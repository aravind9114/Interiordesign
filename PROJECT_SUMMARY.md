# Project Summary - AI Interior Design System

**Complete, production-ready MSc project with dual AI features**

---

## 🎯 What It Does

Upload a room photo → Get two powerful features:

### 1️⃣ AI Design Generation

- Redesign room in 4 styles (Modern/Minimalist/Vintage/Professional)
- Uses Stable Diffusion v1.5 (img2img)
- GPU-accelerated, 8 seconds per generation

### 2️⃣ Smart Furniture Detection + Shopping

- YOLO detects furniture (sofa, bed, table, chair, TV)
- Suggests replacements from 41-item catalog
- Provides 5 instant vendor links per category
- Tracks budget and calculates remaining amount

---

## 🚀 Features

### AI Design Generation

- **6 room types:** Living Room, Bedroom, Kitchen, Bathroom, Office, Dining Room
- **4 design styles:** Modern, Minimalist, Vintage, Professional
- **3 providers:** Offline (local GPU), Replicate API, HuggingFace API
- **Budget tracking:** Estimates cost and shows within/over budget

### Furniture Detection

- **YOLO AI:** Detects 5 furniture categories
- **Local catalog:** 41 items (₹6.5k - ₹2.25L)
  - Sofas: 6 items
  - Beds: 7 items
  - Tables: 7 items
  - Chairs: 8 items
  - TVs: 7 items
- **Online vendors:** 5 curated links per category
  - Pepperfry, Urban Ladder, IKEA, Amazon, WoodenStreet
  - Instant (0ms), no API calls
- **Budget calculator:** Shows remaining budget after purchases

---

## 💻 Tech Stack

### Backend

- **Python 3.10+** with FastAPI
- **PyTorch** for AI models
- **Stable Diffusion v1.5** (runwayml)
- **YOLOv8n** (ultralytics)
- **GPU support** (CUDA) with CPU fallback

### Frontend

- **Pure HTML/CSS/JS** (100% original)
- **No frameworks** (academic integrity)
- **Responsive design**
- **Modern UI** with tabs

### Dependencies

```
torch
diffusers
transformers
ultralytics
opencv-python
fastapi
uvicorn
pillow
pydantic
python-multipart
replicate (optional)
requests (optional)
```

---

## 📂 Project Structure

```
interior-designer-ai/
├── backend/
│   ├── ai/
│   │   ├── __init__.py
│   │   └── detector_yolo.py          # YOLO singleton
│   ├── providers/
│   │   ├── offline_diffusers.py      # Local Stable Diffusion
│   │   ├── online_replicate.py       # Replicate API
│   │   └── online_hf_inference.py    # HuggingFace API
│   ├── services/
│   │   ├── storage.py                # Image saving
│   │   ├── logging.py                # Logging config
│   │   ├── replacement_engine.py     # Catalog suggestions
│   │   └── vendor_links.py           # Online vendor directory
│   ├── catalog.json                  # 41 furniture items
│   ├── main.py                       # FastAPI app
│   ├── requirements.txt
│   └── .env                          # API keys (optional)
│
├── frontend/
│   ├── index.html                    # Main UI
│   ├── styles.css                    # Styling
│   └── script.js                     # Logic
│
└── Documentation/
    ├── HOW_TO_RUN.md                 # Setup guide
    ├── ARCHITECTURE.md               # System design
    ├── BACKEND_CODE_EXPLAINED.md     # Backend walkthrough
    ├── FRONTEND_CODE_EXPLAINED.md    # Frontend walkthrough
    ├── YOLO_FEATURE_EXPLAINED.md     # Detection feature
    ├── ONLINE_VENDOR_SUGGESTIONS.md  # Vendor feature
    └── SEARCH_CATALOG_IMPROVEMENTS.md # Latest updates
```

---

## 🏃 Quick Start

### Prerequisites

- Python 3.10+
- NVIDIA GPU with CUDA (optional but recommended)
- 8GB+ RAM
- 20GB free disk space

### Installation

**1. Clone/Download project**

**2. Install backend dependencies:**

```bash
cd backend
pip install -r requirements.txt
```

**3. Start backend:**

```bash
python main.py
```

Backend runs on `http://localhost:8000`

**4. Start frontend:**

```bash
cd frontend
python -m http.server 8080
```

Frontend runs on `http://localhost:8080`

**5. Open browser:**

```
http://localhost:8080
```

### First Run

- Stable Diffusion downloads ~4GB (one-time)
- YOLO downloads ~6MB (one-time)
- Takes ~30 seconds to initialize
- Subsequent runs are instant

---

## 📊 Performance

| Feature             | GPU (RTX 4060) | CPU (8-core)  |
| ------------------- | -------------- | ------------- |
| Design Generation   | 8 seconds      | 2-3 minutes   |
| Furniture Detection | 1-2 seconds    | 5-10 seconds  |
| Vendor Suggestions  | 0ms (instant)  | 0ms (instant) |

---

## 🎓 MSc Highlights

### Academic Quality

✅ **100% original code** - No copy-paste
✅ **Well-documented** - 7 comprehensive guides
✅ **Production-ready** - Error handling, logging
✅ **Modular design** - Clean architecture

### AI Integration

✅ **Real AI models** - Not templates or mockups
✅ **Dual AI features** - Stable Diffusion + YOLO
✅ **GPU optimization** - 15-40x faster
✅ **Multiple providers** - Offline + 2 online options

### Practical Application

✅ **Solves real problem** - Interior design + shopping
✅ **Budget tracking** - Cost estimation
✅ **Vendor integration** - Real shopping links
✅ **User-friendly** - Clean, modern UI

### Technical Depth

✅ **Backend:** FastAPI, PyTorch, CUDA
✅ **AI:** Stable Diffusion, YOLO, img2img
✅ **Frontend:** Pure JS, responsive design
✅ **Architecture:** Singleton, modular, scalable

---

## 📖 Documentation

### Core Guides

1. **HOW_TO_RUN.md** - Installation and setup
2. **ARCHITECTURE.md** - System design overview
3. **BACKEND_CODE_EXPLAINED.md** - Backend walkthrough (line-by-line)
4. **FRONTEND_CODE_EXPLAINED.md** - Frontend walkthrough (line-by-line)

### Feature Guides

5. **YOLO_FEATURE_EXPLAINED.md** - Detection system (600+ lines)
6. **ONLINE_VENDOR_SUGGESTIONS.md** - Vendor directory feature
7. **SEARCH_CATALOG_IMPROVEMENTS.md** - Latest updates

### API Keys (Optional)

8. **ONLINE_PROVIDERS_SETUP.md** - Replicate & HuggingFace setup

---

## 🌟 Key Features Summary

### Design Generation

- 6 room types × 4 styles = 24 combinations
- 3 providers (offline + 2 online)
- Budget estimation
- Download generated images

### Furniture Detection

- YOLO AI detects 5 categories
- 90%+ confidence detection
- Bounding box coordinates

### Smart Suggestions

- **Local:** 41-item catalog with 6-8 options per category
- **Online:** 5 vendor links per category
- Price range: ₹6.5k - ₹2.25L
- Vendors: Pepperfry, Urban Ladder, IKEA, Amazon, WoodenStreet, Flipkart, Croma

### Budget Tracking

- User sets budget
- System estimates redesign cost
- Calculates furniture replacement cost
- Shows remaining budget

---

## 💡 Use Cases

### For Students

- AI project demonstration
- MSc dissertation
- Portfolio project

### For Designers

- Quick room redesign mockups
- Budget planning tool
- Client presentations

### For Homeowners

- Visualize room redesigns
- Find affordable furniture
- Budget planning

---

## 🔧 Customization

### Add New Vendors

Edit `backend/services/vendor_links.py`:

```python
VENDOR_DIRECTORY = {
    "sofa": [
        {
            "title": "New Vendor Sofas",
            "url": "https://newvendor.com/sofas",
            "snippet": "Description...",
            "domain": "newvendor.com",
            "approx_price": 20000,
            "vendor": "New Vendor"
        }
    ]
}
```

### Add Catalog Items

Edit `backend/catalog.json`:

```json
{
  "sku": "SOF-007",
  "category": "sofa",
  "name": "New Sofa Design",
  "price": 30000,
  "vendor": "Vendor Name",
  "vendor_link": "https://vendor.com"
}
```

### Add Design Styles

Edit `frontend/index.html` and `backend/main.py`:

```html
<option value="industrial">Industrial</option>
```

---

## 📈 Statistics

- **Total Files:** 25+
- **Lines of Code:** 2500+
- **Documentation:** 7 guides, 3000+ lines
- **AI Models:** 2 (Stable Diffusion + YOLO)
- **Furniture Items:** 41
- **Vendor Links:** 25 (5 per category)
- **Features:** 2 major (Generation + Detection)

---

## 🎉 Final Result

A **complete, production-ready AI Interior Design System** that:

1. **Generates** stunning room redesigns using Stable Diffusion
2. **Detects** furniture using YOLO AI
3. **Suggests** affordable replacements from catalog
4. **Provides** instant vendor shopping links
5. **Tracks** budget and remaining amount

**Perfect for MSc demonstration, portfolio, or actual use!** 🎓✨

---

## 📞 Quick Reference

**Backend:** `http://localhost:8000`
**Frontend:** `http://localhost:8080`
**API Docs:** `http://localhost:8000/docs`

**Start Commands:**

```bash
# Terminal 1 - Backend
cd backend && python main.py

# Terminal 2 - Frontend
cd frontend && python -m http.server 8080
```

**First-time setup:** ~30 seconds (model downloads)
**Subsequent runs:** Instant

---

**Created for MSc Interior Design AI System Project**
**GPU-Accelerated Offline Generation + YOLO Detection** 🚀
