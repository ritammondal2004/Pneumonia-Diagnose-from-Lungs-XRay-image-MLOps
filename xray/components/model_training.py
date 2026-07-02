import os
import sys

import bentoml
import joblib
import torch
import torch.nn as nn
from torch.nn import Module
from torch.optim import Optimizer
from torch.optim.lr_scheduler import StepLR, _LRScheduler
from tqdm import tqdm

from xray.constant.train_pipeline import *
from xray.entity.artifacts_entity import ModelTrainerArtifact, DataTransformationArtifact
from xray.entity.config_entity import ModelTrainingConfig
from xray.exception import XRayException
from xray.logger import logging
from xray.ML.model.arch import RobustXrayNet


class ModelTrainer:
    def __init__(
        self,
        data_transformation_artifact: DataTransformationArtifact,
        model_trainer_config: ModelTrainingConfig,
    ):
        self.model_trainer_config: ModelTrainingConfig = model_trainer_config
        self.data_transformation_artifact: DataTransformationArtifact = data_transformation_artifact
        self.model: Module = RobustXrayNet()

        self.train_losses: list[float] = []
        self.test_losses: list[float] = []
        self.train_acc: list[float] = []
        self.test_acc: list[float] = []
               
    def _get_criterion(self) -> nn.Module:
        loss_params = self.model_trainer_config.loss_params
        weights = torch.tensor(loss_params.get("weights", [3.0, 1.0]), dtype=torch.float32).to(
            DEVICE
        ) 
        label_smoothing = loss_params.get("label_smoothing", 0.1)
        return nn.CrossEntropyLoss(weight=weights, label_smoothing=label_smoothing)

    def train(self, optimizer: Optimizer) -> None:
        logging.info("Entered the train method of Model trainer class")

        try:
            self.model.train()  
            criterion = self._get_criterion()
            pbar = tqdm(self.data_transformation_artifact.transformed_train_object)

            correct: int = 0
            processed: int = 0  

            for batch_idx, (data, target) in enumerate(pbar):
                data, target = (
                    data.to(DEVICE),
                    target.to(DEVICE),
                )

                optimizer.zero_grad()

                y_pred = self.model(data)

                loss = criterion(y_pred, target)

                self.train_losses.append(loss.item())

                loss.backward()
                optimizer.step()  

                pred = y_pred.argmax(dim=1, keepdim=True)
                correct += pred.eq(target.view_as(pred)).sum().item()
                processed += len(data) 

                accuracy = 100.0 * correct / processed
                self.train_acc.append(accuracy)

                pbar.set_description(
                    desc=f"Loss={loss.item()} Batch_id={batch_idx} Accuracy={accuracy:0.2f}"
                ) 

            logging.info("Exited the train method of Model trainer class")

        except Exception as e:
            raise XRayException(e, sys)

    def test(self) -> None:


        logging.info("Entered the test method of Model trainer class")

        try:
            """
            Description: To test the model

            input: model, DEVICE, test_loader

            output: average loss and accuracy

            """
             
            self.model.eval()
            criterion = self._get_criterion()
            test_loss: float = 0.0
            correct: int = 0

            with torch.no_grad():
                for data, target in self.data_transformation_artifact.transformed_test_object:
                    data, target = (
                        data.to(DEVICE), 
                        target.to(DEVICE),
                    )
                    
                    output = self.model(data)
                    test_loss += criterion(output, target).item()

                    pred = output.argmax(dim=1, keepdim=True)
                    correct += pred.eq(target.view_as(pred)).sum().item()

            test_loss /= len(self.data_transformation_artifact.transformed_test_object.dataset)
            self.test_losses.append(test_loss)
            accuracy = 100.0 * correct / len(
                self.data_transformation_artifact.transformed_test_object.dataset
            )
            self.test_acc.append(accuracy)

            print(
                "Test set: Average loss: {:.4f}, Accuracy: {}/{} ({:.2f}%)\n".format(
                    test_loss,
                    correct,
                    len(self.data_transformation_artifact.transformed_test_object.dataset),
                    accuracy,
                )
            )

            logging.info(
                "Test set: Average loss: {:.4f}, Accuracy: {}/{} ({:.2f}%)".format(
                    test_loss,
                    correct,
                    len(self.data_transformation_artifact.transformed_test_object.dataset),
                    accuracy,
                )
            )

            logging.info("Exited the test method of Model trainer class")

        except Exception as e:
            raise XRayException(e, sys)

    def initiate_model_trainer(self) -> ModelTrainerArtifact:
        try:
            logging.info(
                "Entered the initiate_model_trainer method of Model trainer class"
            )

            model: Module = self.model.to(self.model_trainer_config.device)

            optimizer: Optimizer = torch.optim.AdamW(
                filter(lambda p: p.requires_grad, model.parameters()),
                **self.model_trainer_config.optimizer_params,
            )

            scheduler: _LRScheduler = StepLR(
                optimizer=optimizer, **self.model_trainer_config.scheduler_params
            )
                            
            epochs = int(self.model_trainer_config.epochs)
            for epoch in range(1, epochs + 1):
                print("Epoch :", epoch)  

                self.train(optimizer=optimizer)
                self.test()

                scheduler.step()

            os.makedirs(self.model_trainer_config.artifact_dir, exist_ok=True)
            torch.save(model, self.model_trainer_config.trained_model_path)

            train_transforms_obj = joblib.load(
                self.data_transformation_artifact.train_transform_file_path
            )

            bentoml.pytorch.save_model(
                name=self.model_trainer_config.trained_bentoml_model_name,
                model=model,
                custom_objects={
                    self.model_trainer_config.train_transforms_key: train_transforms_obj
                },
            )

            model_trainer_artifact: ModelTrainerArtifact = ModelTrainerArtifact(
                trained_model_path=self.model_trainer_config.trained_model_path
            )

            logging.info(
                "Exited the initiate_model_trainer method of Model trainer class"
            )

            return model_trainer_artifact

        except Exception as e:
            raise XRayException(e, sys)
