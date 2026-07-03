import os
from dataclasses import dataclass
from torch import device
from xray.constant.train_pipeline import *

@dataclass
class DataIngestionConfig:
    def __init__(self):
        self.s3_data_folder: str = S3_DATA_FOLDER
        self.s3_bucket_name: str = BUCKET_NAME
        self.artifact_dir: str = os.path.join(ARTIFACT_DIR, TIMESTAMP)
        self.data_path: str = os.path.join(
            self.artifact_dir, "data_ingestion", self.s3_data_folder
        )
        self.train_data_path: str = os.path.join(self.data_path, "train")
        self.test_data_path: str = os.path.join(self.data_path, "test")

@dataclass
class DataTransformationConfig:
    def __init__(self):
        self.color_jitter_transforms: dict = {
            "brightness": BRIGHTNESS,
            "contrast": CONTRAST,
            "saturation": SATURATION,
            "hue": HUE,
        }
        self.RESIZE: int = RESIZE
        self.CENTERCROP: int = CENTERCROP
        self.RANDOMROTATION: int = RANDOMROTATION
        self.HORIZONTAL_FLIP: bool = HORIZONTAL_FLIP 
        
        self.normalize_transforms: dict = {
            "mean": NORMALIZE_MEAN,
            "std": NORMALIZE_STD,
        }
        self.data_loader_params: dict = {
            "batch_size": BATCH_SIZE,
            "shuffle": SHUFFLE,
            "pin_memory": PIN_MEMORY,
        }
        self.artifact_dir: str = os.path.join(
            ARTIFACT_DIR, TIMESTAMP, "data_transformation"
        )
        self.train_transforms_file: str = os.path.join(
            self.artifact_dir, TRAIN_TRANSFORMS_FILE
        )
        self.test_transforms_file: str = os.path.join(
            self.artifact_dir, TEST_TRANSFORMS_FILE
        )  


@dataclass
class ModelTrainingConfig:
    def __init__(self):
        self.artifact_dir: str = os.path.join(
            ARTIFACT_DIR, TIMESTAMP, TRAINED_MODEL_DIR
        )
        self.trained_bentoml_model_name: str = BENTOML_MODEL_NAME

        self.trained_model_path: str = os.path.join(
            self.artifact_dir, TRAINED_MODEL_NAME
        )
        self.train_transforms_key: str = TRAIN_TRANSFORMS_KEY
        self.epochs: str = EPOCH

        self.optimizer_params : dict = {"lr" : LEARNING_RATE, "weight_decay" : WT_DECAY}
        self.scheduler_params : dict = {"step_size" : STEP_SIZE, "gamma" : GAMMA} 
        self.loss_params: dict = {
            "weights": [3.0, 1.0],  # Normal class higher weight due to imbalance
            "label_smoothing": 0.1
        }  
        self.device : device = DEVICE
        

@dataclass
class ModelEvaluationConfig:
    def __init__(self):
        self.device = DEVICE
        self.test_loss : float = 0
        self.test_accuracy: float = 0

        self.total: float = 0
        self.total_batch : int = 0
                 
        self.optimizer_params : dict = {
            "lr" : LEARNING_RATE, "weight_decay" : WT_DECAY
        }

        self.loss_params: dict = {
            "weights": [3.0, 1.0],
            "label_smoothing": 0.1,
        }
        self.train_transforms_key : str = TRAIN_TRANSFORMS_KEY

