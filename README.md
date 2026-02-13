
# Budget-Constrained AI Interior Design System  
### MSc Project Submission

This project presents a full-stack AI-powered interior design system that integrates generative models, computer vision, GPU acceleration, and budget-aware decision logic into a unified application.

The system supports both fully offline execution (with CUDA acceleration) and online inference providers, making it flexible across different hardware environments.

---

## 🎓 Project Overview

This project demonstrates the integration of:

- Generative AI (Stable Diffusion via Diffusers)
- Computer Vision (YOLOv8 object detection)
- GPU acceleration (CUDA with PyTorch)
- REST API architecture (FastAPI)
- Budget-constrained decision systems
- Multi-provider AI deployment strategy
- Full-stack development (Backend + Frontend)

All components were designed and implemented specifically for this MSc project following modern development standards and modular architecture principles.

---

## ✨ Core Features

### 🖼️ AI-Based Interior Design Generation

- Offline AI Generation – Fully functional without internet  
- CUDA GPU Acceleration – Optimized for NVIDIA GPUs (~10–30 seconds per image)  
- CPU Fallback Mode – Runs on systems without GPU  
- Automated Prompt Engineering – No manual user prompt required  
- Budget-Constrained Design Logic – Style-based cost estimation  

#### Multiple AI Providers

- Local Diffusers (Offline)
- Replicate API
- HuggingFace Inference API

#### Supported Room Types

- Living Room
- Bedroom
- Kitchen
- Bathroom
- Office
- Dining Room

#### Supported Design Styles

- Modern
- Minimalist
- Vintage
- Professional

---

## 🛋️ Furniture Detection & Intelligent Suggestions

- YOLOv8 Object Detection  
  - Detects sofa, bed, table, chair, TV from uploaded images  

- Dual Suggestion System  
  - Local Furniture Catalog (41 structured entries)  
  - Online Vendor Links (Pepperfry, Urban Ladder, IKEA, Amazon, etc.)

- Dynamic Budget Calculator  
  - Tracks remaining budget after furniture selection  

- Direct Shopping Links  
  - Real-world vendor redirection  

---

## 🖥️ User Interface

- Clean, professional UI  
- Tab-based suggestion switching  
- Image download functionality  
- Responsive layout (desktop + tablet)  

---

## 🚀 Quick Start Guide

### Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Optional: Install PyTorch with CUDA
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

python main.py
````

Backend runs at:

```
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend
start index.html  # Windows
```

Or run a simple local server:

```bash
python -m http.server 8080
```

---

## 📖 System Workflow

1. User uploads a room image
2. Selects room type and style
3. Chooses AI provider
4. Enters budget
5. System generates redesigned image
6. YOLO detects furniture
7. Budget-aware suggestions are provided
8. User downloads final output

---

## 🏗️ System Architecture

### Backend (FastAPI)

```
backend/
├── main.py
├── config.py
├── providers/
│   ├── offline_diffusers.py
│   ├── online_replicate.py
│   └── online_hf_inference.py
└── services/
    ├── budget.py
    ├── storage.py
    └── logging.py
```

### Frontend (Vanilla Web Stack)

```
frontend/
├── index.html
├── styles.css
└── script.js
```

---

## 🎯 System Requirements

### Minimum (CPU Mode)

* Python 3.10+
* 8GB RAM
* 15GB disk space
* Modern browser

### Recommended (GPU Mode)

* NVIDIA GPU (4GB+ VRAM)
* CUDA 12.1+
* 16GB RAM
* Windows/Linux

---

## 📊 Performance Metrics

| Mode       | Generation Time | Quality |
| ---------- | --------------- | ------- |
| GPU (CUDA) | 10–30 seconds   | High    |
| CPU        | 2–5 minutes     | High    |

Image quality remains consistent across both modes; GPU significantly improves speed.

---

## 🔧 Configuration Options

### Online Provider Setup

Create `backend/.env`:

```
REPLICATE_API_TOKEN=your_token_here
HF_API_TOKEN=your_token_here
```

### Budget Rule Customization

Modify in `backend/config.py`:

```python
BUDGET_ESTIMATES = {
    "Minimalist": 150000,
    "Modern": 250000,
    "Vintage": 200000,
    "Professional": 300000,
}
```

---

## 🎨 Design Principles

This system was built with emphasis on:

* Modular architecture
* Hardware adaptability (GPU optional)
* Extensible provider system
* Clear separation of concerns
* Professional documentation
* Academic research-level structure

```




