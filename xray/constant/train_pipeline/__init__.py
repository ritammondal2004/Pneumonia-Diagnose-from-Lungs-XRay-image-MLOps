from datetime import datetime
from typing import List

import torch 

TIMESTAMP: datetime = datetime.now().strftime("%d_%m_%Y_%H_%M_%S")

# Data Ingestion Constants
ARTIFACT_DIR: str = "artifacts"

HORIZONTAL_FLIP: bool = True

BUCKET_NAME: str = "lungxray-rtm-2026"

S3_DATA_FOLDER: str = "data"

CLASS_LABEL_1: str = "NORMAL"

CLASS_LABEL_2: str = "PNEUMONIA"

BRIGHTNESS: int = 0.10


CONTRAST: int = 0.1

SATURATION: int = 0.2

HUE: int = 0.15

RESIZE: int = 224

CENTERCROP: int = 224

RANDOMROTATION: int = 10

NORMALIZE_MEAN: List[int] = [0.485, 0.456, 0.406]

NORMALIZE_STD: List[int] = [0.229, 0.224, 0.225]

TRAIN_TRANSFORMS_KEY: str = "xray_train_transforms"

TRAIN_TRANSFORMS_FILE: str = "train_transforms.pkl"

TEST_TRANSFORMS_FILE: str = "test_transforms.pkl"

BATCH_SIZE: int = 2

SHUFFLE: bool = False

PIN_MEMORY: bool = True

# Model Training Constants
TRAINED_MODEL_DIR: str = "trained_model"

TRAINED_MODEL_NAME: str = "XRay_model-v1.pt"

DEVICE: torch.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

STEP_SIZE: int = 5

GAMMA: int = 0.75

EPOCH: int = 15

LEARNING_RATE : float = 0.0001

WT_DECAY : float = 0.01

BENTOML_MODEL_NAME: str = "xray_model-v1"

BENTOML_SERVICE_NAME: str = "xray_service"

BENTOML_ECR_IMAGE: str = "xray_bento_image"

PREDICTION_LABEL: dict = {"0": CLASS_LABEL_1, 1: CLASS_LABEL_2} 

# Your personal AWS Region (e.g., 'us-east-1', 'ap-south-1', etc.)
REGION_NAME: str = "eu-north-1" 

# Replace with your 12-digit AWS Account ID
AWS_ACCOUNT_ID: str = "569944376409"  
 
# unique container registry endpoint
ECR_REGISTRY_URL: str = f"{AWS_ACCOUNT_ID}.dkr.ecr.{REGION_NAME}.amazonaws.com"

           
