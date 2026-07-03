
import sys
                  
from dotenv import load_dotenv
                
# Load environment variables from the .env file at the root 
load_dotenv()     
                  
from xray.exception import XRayException
from xray.pipeline.TrainPipeline import TrainPipeline

def start_training():  
    try:
        train_pipeline = TrainPipeline()
        train_pipeline.run_pipeline()  

    except Exception as e:
        raise XRayException(e, sys)  

                                  
if __name__ == "__main__":      
    start_training()             
