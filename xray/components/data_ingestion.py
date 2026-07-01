import sys

from xray.CloudStorage.s3_operations import S3Operation
from xray.constant.train_pipeline import *
from xray.entity.artifacts_entity import DataIngestionArtifact
from xray.entity.config_entity import DataIngestionConfig 
from xray.exception import XRayException
from xray.logger import logging 



class DataIngestion:
    def __init__(self, data_ingestion_config : DataIngestionConfig):
        self.data_ingestion_config = data_ingestion_config
        self.s3 = S3Operation()

    def get_data_from_s3(self)-> None:
        try:
            logging.info("entered the get get_data_from_s3 method of data ingestion class") 

            self.s3.sync_folder_from_s3(
                folder = self.data_ingestion_config.data_path,
                bucket_name = self.data_ingestion_config.s3_bucket_name,
                bucket_folder_name = self.data_ingestion_config.s3_data_folder
            ) 

            logging.info("Exited the get_data_from_s3 method of data ingestion class") 
                           
        except Exception as e:
            raise XRayException(e, sys)


    def initiate_data_ingestion(self)-> DataIngestionArtifact:
        logging.info("Entered the initiate_data_ingestion method of Data ingestion class")

        try:
            self.get_data_from_s3() 

            data_ingestion_artifact:DataIngestionArtifact = DataIngestionArtifact(
                train_path = self.data_ingestion_config.train_data_path,
                test_path = self.data_ingestion_config.test_data_path
            ) 
            logging.info(
                "Exited the initiate_data_ingestion method of Data ingestion class"
            )
            return data_ingestion_artifact  
        
        except Exception as e:
            raise XRayException(e, sys)
