import __main__
from pathlib import Path

from fastapi import FastAPI , UploadFile, File
from xray.ML.model.arch import ResBlock, RobustXrayNet
import torch 
import torchvision.transforms as transforms
from PIL import Image 


app = FastAPI()  

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  

setattr(__main__, "ResBlock", ResBlock)
setattr(__main__, "RobustXrayNet", RobustXrayNet)
                        
#Initialize model        
model = RobustXrayNet().to(device) 

MODEL_PATH = Path(__file__).resolve().parent / "XRay_model-v1.pt"
checkpoint = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=False
)

if isinstance(checkpoint, dict):
    model.load_state_dict(checkpoint)
elif hasattr(checkpoint, "state_dict"):
    model.load_state_dict(checkpoint.state_dict())
else:
    model = checkpoint.to(device)

model.eval() 

transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor() 
    ]
) 

label_map = {0: 'Normal', 1:'Pneumonia'} 

@app.post("/predict") 
async def predict(file: UploadFile = File(...)):

    image = Image.open(file.file).convert("RGB")  

    if file.content_type not in ["image/jpeg", "image/png"]:
        return {"error": "Only JPEG or PNG images are supported."}
       
    input_tensor = transform(image).unsqueeze(0).to(device) 

    with torch.inference_mode():
        output = model(input_tensor) 
        prediction_index = torch.argmax(output, dim=1).item()  
        prediction_label = label_map.get(prediction_index, "Unknown")  
      
        probabilities = torch.softmax(output, dim=1)
        confidence = probabilities[0][prediction_index].item()

    return {
    "prediction": prediction_label,
    "confidence": round(confidence,3)
    }
  
