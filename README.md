
# 🩺 AI-Powered Pneumonia Detection System

### End-to-End Deep Learning & MLOps Pipeline for Automated Chest X-Ray Classification

**Self Project**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## Author

| Name | Role | LinkedIn | GitHub | Portfolio |
|------|------|----------|---------|-----------|
| **Ritam Mondal** | Developer | [LinkedIn](https://www.linkedin.com/in/ritam-mondal-86a369287/) | [GitHub](https://github.com/ritammondal2004) | [Portfolio](https://ritammondal.vercel.app/) |

---

# Live Demo

### Frontend [Demo link](https://pneumonia-diagnose.vercel.app/)


### Backend API [link](https://pneumonia-predicto.onrender.com/docs)


---

# Project Overview

This project presents an end-to-end Deep Learning and MLOps pipeline for automated pneumonia detection from chest X-ray images.

A custom Residual Convolutional Neural Network (**RobustXrayNet**) is trained using PyTorch and deployed as a FastAPI application. The backend is containerized using Docker and deployed on Render, providing a REST API for real-time inference.

The application predicts whether a chest X-ray belongs to the **Normal** or **Pneumonia** class and returns a confidence score.

---

# Features

- Chest X-ray image classification
- Custom Residual CNN (RobustXrayNet)
- Confidence score prediction
- FastAPI REST API
- Interactive Swagger documentation
- Dockerized deployment
- Modular MLOps pipeline
- Cloud deployment on Render

---

# Tech Stack

| Category | Technologies |
|----------|--------------|
| Programming | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) |
| Deep Learning | ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white) |
| Backend | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) |
| Deployment | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |
| MLOps | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |
| Version Control | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |

---

# Model Architecture

The model uses a custom **Residual Convolutional Neural Network (RobustXrayNet)** inspired by ResNet.

```
Input (224 × 224 RGB)
        │
        ▼
Initial Convolution
        │
        ▼
Residual Block × 3
        │
        ▼
Global Average Pooling
        │
        ▼
Dropout
        │
        ▼  
Fully Connected Layer
        │
        ▼
Prediction
```

---

# Dataset [Kaggle link](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia/data)

- **Training Images:** 5,856 Pediatric Chest X-rays
- **Classes:** Normal, Pneumonia
- **Input Size:** 224 × 224 RGB Images

---

# Project Structure

```text
xray/
│
├── components/
│   ├── data_ingestion
│   ├── data_validation
│   ├── data_transformation
│   ├── model_trainer
│   ├── model_evaluation
│   └── model_pusher
│
├── configuration/
├── constants/
├── entity/
├── pipeline/
├── ML/
├── logger/
└── exception/
```


---


Swagger Documentation

```
https://pneumonia-predicto.onrender.com/docs
```

---

# Local Setup

Clone the repository

```bash
git clone https://github.com/ritammondal2004/Pneumonia-Diagnose-from-Lungs-XRay-image-MLOps.git

cd Pneumonia-Diagnose-from-Lungs-XRay-image-MLOps
```

Create virtual environment

```bash
python -m venv .venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the API

```bash
uvicorn app:app --reload
```

Open

```
http://127.0.0.1:8000/docs
```

---

# Docker

Build

```bash
docker build -t pneumonia-detector .
```

Run  

```bash
docker run -p 8000:8000 pneumonia-detector
```

---

# Future Improvements

- Explainable AI (Grad-CAM)
- MLflow Integration
- CI/CD with GitHub Actions
- AWS Deployment           
- Model Registry  
- Multi-class Lung Disease Classification
                         
---

If you find this project useful, consider giving it a ⭐.