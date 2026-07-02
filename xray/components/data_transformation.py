
import os
import sys
from typing import Tuple  

import joblib
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from torchvision.datasets import ImageFolder  
from xray.entity.artifacts_entity import DataTransformationArtifact, DataIngestionArtifact
from xray.entity.config_entity import DataTransformationConfig
from xray.exception import XRayException
from xray.logger import logging  

class DataTransformation:
    def __init__(self, data_transformation_config: DataTransformationConfig, data_ingestion_artifact: DataIngestionArtifact):
        self.data_transformation_config = data_transformation_config
        self.data_ingestion_artifact = data_ingestion_artifact  

    def TrainDataTransform(self)->transforms.Compose:
        try:
            logging.info("Entered the TrainDataTransform method of Data transformation class") 

            trainTransform: transforms.Compose = transforms.Compose(
                [
                    transforms.Resize(self.data_transformation_config.RESIZE),
                    transforms.CenterCrop(self.data_transformation_config.CENTERCROP),
                    transforms.RandomRotation(self.data_transformation_config.RANDOMROTATION),
                    transforms.RandomHorizontalFlip(self.data_transformation_config.HORIZONTAL_FLIP),
                    transforms.ColorJitter(**self.data_transformation_config.color_jitter_transforms),
                    transforms.ToTensor(),
                    transforms.Normalize(**self.data_transformation_config.normalize_transforms) 
                ] 
            )  

            logging.info("Exited the TrainDataTransform method of Data transformation class")
            return trainTransform 
        except Exception as e:
            raise XRayException(e, sys)  
        
    def TestDataTransform(self) -> transforms.Compose:
        try:
            logging.info("Entered the TestDataTransform method of Data transformation class") 

            testTransform: transforms.Compose = transforms.Compose(
                [
                    transforms.Resize(self.data_transformation_config.RESIZE),
                    transforms.CenterCrop(self.data_transformation_config.CENTERCROP),
                    transforms.ToTensor(),
                    transforms.Normalize(**self.data_transformation_config.normalize_transforms) 
                ]
            )  

            logging.info("Exited the TestDataTransform method of Data transformation class") 
            return testTransform 
        
        except Exception as e:
            raise XRayException(e, sys)  
        
    def DataLoader(
            self, train_transform: transforms.Compose, test_transform: transforms.Compose
    )-> Tuple[DataLoader, DataLoader]:
        
        try:
            logging.info("Entered the DataLoader method of Data transformation class")  

            train_data: Dataset = ImageFolder(
                os.path.join(self.data_ingestion_artifact.train_path) , 
                transform=train_transform 
            )  

            test_data: Dataset = ImageFolder(
                os.path.join(self.data_ingestion_artifact.test_path),
                transform = test_transform
            ) 

            logging.info("Created the train and test dataset using ImageFolder class of datatransforms module")

            train_loader: DataLoader = DataLoader(train_data, **self.data_transformation_config.data_loader_params)  
            test_loader: DataLoader = DataLoader(test_data, **self.data_transformation_config.data_loader_params)  

            logging.info("Exited the DataLoader method of Data transformation class")
            return train_loader, test_loader
        
        except Exception as e:
            raise XRayException(e, sys)
        
    def initiate_data_transformation(self) -> DataTransformationArtifact: 

        try:
            logging.info("Entered the initiate_data_transformation method of Data transformation class")

            train_transform: transforms.Compose = self.TrainDataTransform() 
            test_transform: transforms.Compose = self.TestDataTransform() 

            os.makedirs(self.data_transformation_config.artifact_dir, exist_ok=True)  

            joblib.dump(
                train_transform, self.data_transformation_config.train_transforms_file
            ) 

            joblib.dump(
                test_transform, self.data_transformation_config.test_transforms_file
            ) 

            train_loader, test_loader = self.DataLoader(train_transform=train_transform, test_transform=test_transform) 

            Data_transformation_artifact: DataTransformationArtifact = DataTransformationArtifact(
                transformed_train_object= train_loader,
                transformed_test_object= test_loader, 
                train_transform_file_path = self.data_transformation_config.train_transforms_file,
                test_transform_file_path = self.data_transformation_config.test_transforms_file
            )  

            logging.info("Exited the initiate_data_transformation method of Data transformation class") 

            return Data_transformation_artifact
        
        except Exception as e:
            raise XRayException(e, sys)