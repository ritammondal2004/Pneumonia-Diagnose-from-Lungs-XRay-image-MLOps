import os
import sys

from typing import Tuple

import torch
from torch.nn import CrossEntropyLoss, Module  
from torch.optim import AdamW, Optimizer  
from torch.utils.data import DataLoader 

from xray.entity.artifacts_entity import (
    DataTransformationArtifact,
    ModelTrainerArtifact,
    ModelEvaluationArtifact,
) 

from xray.entity.config_entity import ModelEvaluationConfig
from xray.exception import XRayException
from xray.logger import logging  

from xray.ML.model.arch import RobustXrayNet

class ModelEvaluation:
    def __init__(
        self,
        data_transformation_artifact: DataTransformationArtifact,
        model_trainer_artifact: ModelTrainerArtifact,
        model_evaluation_config: ModelEvaluationConfig,
    ):
        self.data_transformation_artifact = data_transformation_artifact
        self.model_trainer_artifact = model_trainer_artifact
        self.model_evaluation_config = model_evaluation_config



    def configuration(self) -> Tuple[DataLoader, Module, float, Optimizer]:
        logging.info("Entered the configuration method of Model evaluation class")

        try:
            test_dataloader: DataLoader = (
                self.data_transformation_artifact.transformed_test_object
            )

            model: Module = RobustXrayNet()
            model = torch.load(self.model_trainer_artifact.trained_model_path)

            model.to(self.model_evaluation_config.device)

            loss_params = self.model_evaluation_config.loss_params
            weights = torch.tensor(
                loss_params.get("weights", [3.0, 1.0]),
                dtype=torch.float32,
                device=self.model_evaluation_config.device,
            )
            label_smoothing = loss_params.get("label_smoothing", 0.1)

            cost: Module = CrossEntropyLoss(
                weight=weights,
                label_smoothing=label_smoothing,
            )

            optimizer: Optimizer = AdamW(
                filter(lambda p: p.requires_grad, model.parameters()),
                **self.model_evaluation_config.optimizer_params,
            )

            model.eval()

            logging.info("Exited the configuration method of Model evaluation class")

            return test_dataloader, model, cost, optimizer

        except Exception as e:
            raise XRayException(e, sys) from e 
        

    #################

    def test_net(self) -> float:
        logging.info("Entered the test_net method of Model evaluation class")
                  
        try:
            test_dataloader, model, cost, _ = self.configuration()

            test_loss = 0.0
            correct = 0

            with torch.no_grad():
                for data, target in test_dataloader:
                    data = data.to(self.model_evaluation_config.device)
                    target = target.to(self.model_evaluation_config.device)

                    output = model(data)
                    loss = cost(output, target)

                    test_loss += loss.item()

                    pred = output.argmax(dim=1, keepdim=True)
                    correct += pred.eq(target.view_as(pred)).sum().item()

                    self.model_evaluation_config.total_batch += 1
                    self.model_evaluation_config.total += target.size(0)
                    self.model_evaluation_config.test_loss += loss.item()
                    self.model_evaluation_config.test_accuracy += (
                        pred.eq(target.view_as(pred)).sum().item()
                    )

            dataset_size = len(test_dataloader.dataset)
            average_loss = test_loss / dataset_size
            accuracy = 100.0 * correct / dataset_size

            logging.info(
                f"Validation set: Average loss: {average_loss:.4f}, "
                f"Accuracy: {correct}/{dataset_size} ({accuracy:.2f}%)"
            )

            logging.info("Exited the test_net method of Model evaluation class")

            return accuracy

        except Exception as e:
            raise XRayException(e, sys)

    def initiate_model_evaluation(self) -> ModelEvaluationArtifact:
        logging.info(
            "Entered the initiate_model_evaluation method of Model evaluation class"
        )

        try:
            accuracy = self.test_net()
            dataset_size = len(
                self.data_transformation_artifact.transformed_test_object.dataset
            )
            average_loss = (
                self.model_evaluation_config.test_loss / dataset_size
                if dataset_size > 0
                else 0.0
            )

            model_evaluation_artifact: ModelEvaluationArtifact = ModelEvaluationArtifact(
                is_model_accepted=True,
                test_loss=average_loss,
                model_accuracy=accuracy,
            )

            logging.info(
                "Exited the initiate_model_evaluation method of Model evaluation class"
            )                                          
                                                    
            return model_evaluation_artifact        

        except Exception as e:
            raise XRayException(e, sys) from e
                            