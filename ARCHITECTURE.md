# Project Architecture & Workflow

This document explains how the Budget-Constrained AI Interior Design System works, its architecture, and the complete workflow from user input to generated design.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Complete Workflow](#complete-workflow)
7. [AI Generation Process](#ai-generation-process)
8. [Budget Estimation System](#budget-estimation-system)
9. [Design Decisions](#design-decisions)

---

## System Overview

This is a **full-stack web application** that uses AI to redesign interior spaces based on user-uploaded photos. The system:

1. **Accepts** a room photo from the user
2. **Processes** the image using AI (Stable Diffusion)
3. **Generates** a redesigned version in the selected style
4. **Estimates** the cost of implementing the design
5. **Displays** the result with budget analysis

### Key Features

- **Offline Operation**: Works without internet using local GPU
- **GPU Acceleration**: Fast generation (8-10 seconds)
- **Budget Tracking**: Rule-based cost estimation
- **Multiple Providers**: Offline, Replicate, or HuggingFace
- **No Prompts Needed**: Automatic prompt generation
- **Simple Interface**: Clean HTML/CSS/JS frontend

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Frontend (HTML/CSS/JavaScript)                    │    │
│  │  - Image upload & preview                          │    │
│  │  - Form controls (room type, style, budget)        │    │
│  │  - Display results & budget status                 │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          │ HTTP POST (FormData)             │
│                          ▼                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ http://localhost:8000/api/generate
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI Server)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  main.py (API Endpoint)                            │    │
│  │  - Receive image & parameters                      │    │
│  │  - Save uploaded image                             │    │
│  │  - Estimate budget                                 │    │
│  │  - Call AI provider                                │    │
│  │  - Return results                                  │    │
│  └────────────────────────────────────────────────────┘    │
│           │                    │                    │        │
│           ▼                    ▼                    ▼        │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Storage    │    │   Budget     │    │  AI Provider │  │
│  │  Service    │    │   Service    │    │   (Offline)  │  │
│  │             │    │              │    │              │  │
│  │ - Save img  │    │ - Estimate   │    │ - Load model │  │
│  │ - Resize    │    │ - Check      │    │ - Generate   │  │
│  │ - Cache     │    │   budget     │    │   image      │  │
│  └─────────────┘    └──────────────┘    └──────────────┘  │
│                                                │             │
│                                                ▼             │
│                                      ┌──────────────────┐   │
│                                      │  GPU (CUDA)      │   │
│                                      │  Stable Diffusion│   │
│                                      │  PyTorch         │   │
│                                      └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid & Flexbox
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Fetch API**: HTTP requests to backend
- **FormData**: Multipart file uploads

### Backend

- **Python 3.10+**: Programming language
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **PyTorch**: Deep learning framework
- **Diffusers**: Hugging Face Stable Diffusion library
- **Pillow (PIL)**: Image processing
- **Pydantic**: Data validation

### AI/ML

- **Stable Diffusion v1.5**: Image-to-image generation model
- **CUDA**: GPU acceleration (optional)
- **img2img Pipeline**: Preserves room layout while applying style

---

## Backend Architecture

### File Structure

```
backend/
├── main.py                      # FastAPI app & API endpoints
├── config.py                    # Configuration & settings
├── requirements.txt             # Python dependencies
├── test_setup.py               # Installation verification
├── .env                        # API tokens (optional, ignored by git)
├── providers/
│   ├── __init__.py
│   ├── offline_diffusers.py   # Local GPU AI provider
│   ├── online_replicate.py    # Replicate API provider
│   └── online_hf_inference.py # HuggingFace API provider
├── services/
│   ├── __init__.py
│   ├── budget.py              # Budget estimation logic
│   ├── storage.py             # Image saving & caching
│   └── logging.py             # Structured logging
├── uploads/                   # Temporary image uploads
└── generated/                 # Generated designs
```

### Components

#### 1. **main.py** - API Server

- Sets up FastAPI application
- Configures CORS for frontend access
- Defines `/api/generate` endpoint
- Handles file uploads and form data
- Orchestrates all services
- Returns JSON responses

#### 2. **config.py** - Configuration

- Loads environment variables
- Defines model settings
- Sets image dimensions
- Contains budget estimation rules
- Manages API tokens

#### 3. **providers/** - AI Implementations

Each provider implements the same interface:

```python
def generate_image(image_path, room_type, style):
    # Process image
    # Generate new design
    return (output_path, generation_time)
```

Providers:

- **offline_diffusers.py**: Local Stable Diffusion with GPU
- **online_replicate.py**: Replicate API integration
- **online_hf_inference.py**: HuggingFace Inference API

#### 4. **services/** - Support Services

- **budget.py**: Estimates cost based on style, checks budget
- **storage.py**: Saves images, generates unique filenames, handles caching
- **logging.py**: Structured console logging

---

## Frontend Architecture

### File Structure

```
frontend/
├── index.html     # Complete UI structure
├── styles.css     # All styling (responsive)
└── script.js      # All functionality
```

### Components (in HTML)

1. **Header**: Title and description
2. **Upload Section**: Drag & drop zone with preview
3. **Controls Section**: Form inputs (room type, style, provider, budget)
4. **Results Section**:
   - Original image display
   - Generated image display
   - Budget status card
   - Generation info card
5. **Footer**: System information

### JavaScript Modules (in script.js)

1. **Event Listeners**: Handle user interactions
2. **File Upload**: Validate, preview, store uploaded image
3. **API Integration**: Send FormData to backend
4. **UI Updates**: Display results, show loading states
5. **Error Handling**: Show user-friendly error messages
6. **Download**: Fetch and download generated images

---

## Complete Workflow

### Step-by-Step Process

#### 1. **User Uploads Image**

```
User action → File validation → Preview image → Enable generate button
```

**What happens:**

- User drags image or clicks to browse
- JavaScript validates file type (must be image)
- JavaScript validates file size (max 10MB)
- FileReader creates base64 preview
- Image displayed in "Original Photo" section
- File stored in memory as `uploadedFile`

#### 2. **User Configures Settings**

```
User selects → Room type, Style, Provider, Budget
```

**Values:**

- Room Type: Living Room, Bedroom, Kitchen, etc.
- Style: Minimalist, Modern, Vintage, Professional
- Provider: Offline, Replicate, or HuggingFace
- Budget: Number in Rupees

#### 3. **User Clicks Generate**

```
Validate inputs → Show loading state → Send API request
```

**Frontend actions:**

- Disable generate button
- Show loading spinner in results section
- Hide previous results

#### 4. **Backend Receives Request**

```
POST /api/generate
Content-Type: multipart/form-data

FormData:
- image: [File]
- room_type: "Living Room"
- style: "Minimalist"
- budget: 200000
- provider: "offline"
```

**Backend actions:**

1. Extract form data
2. Validate inputs
3. Save uploaded image to `uploads/`
4. Generate unique filename

#### 5. **Budget Estimation**

```python
# services/budget.py
estimated_cost = BUDGET_ESTIMATES[style]  # e.g., 150000 for Minimalist
status = "within_budget" if estimated_cost <= budget else "over_budget"
```

**Rules:**

- Minimalist: ₹150,000
- Modern: ₹250,000
- Vintage: ₹200,000
- Professional: ₹300,000

#### 6. **AI Generation**

```
Select provider → Load model → Generate prompt → Process image → Save result
```

**Offline Provider Detailed Process:**

a. **Model Loading** (first request only):

```python
# Load Stable Diffusion img2img pipeline
pipeline = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1.5",
    torch_dtype=torch.float16,  # Half precision for GPU
)
pipeline.to("cuda")  # Move to GPU
```

b. **Prompt Generation**:

```python
prompt = f"photorealistic {room_type.lower()} interior redesign, {style.lower()} style, realistic lighting, high detail, wide angle, interior design render"

# Example: "photorealistic living room interior redesign, minimalist style, realistic lighting, high detail, wide angle, interior design render"
```

c. **Image Processing**:

```python
# Load uploaded image
init_image = Image.open(image_path).convert("RGB")

# Resize to model's expected dimensions (512x512)
init_image = init_image.resize((512, 512))

# Generate with img2img
output = pipeline(
    prompt=prompt,
    image=init_image,
    strength=0.65,  # How much to change (0=no change, 1=completely new)
    guidance_scale=7.5,  # How closely to follow prompt
    num_inference_steps=30  # Quality vs speed tradeoff
)

result_image = output.images[0]
```

d. **Save Result**:

```python
output_path = f"generated/offline_{uuid}.png"
result_image.save(output_path)
```

#### 7. **Backend Returns Response**

```json
{
  "image_url": "http://localhost:8000/generated/offline_abc123.png",
  "estimated_cost": 150000,
  "budget": 200000,
  "status": "within_budget",
  "provider_used": "offline",
  "time_taken_sec": 7.8
}
```

#### 8. **Frontend Displays Results**

```
Receive response → Hide loading → Show image → Update budget cards
```

**Actions:**

- Set generated image src to `image_url`
- Display budget status badge (green/red)
- Show cost comparison
- Display provider and time
- Show download button

---

## AI Generation Process

### Stable Diffusion img2img Pipeline

#### What is img2img?

Unlike text-to-image (generates from scratch), **image-to-image** (img2img):

- Takes an existing image as input
- Preserves the original composition and layout
- Applies style transformations
- Maintains room structure while changing aesthetics

#### Why img2img for Interior Design?

1. **Preserves Layout**: Keeps the room's physical structure
2. **Maintains Perspective**: Camera angle stays the same
3. **Realistic Results**: Based on actual room, not imagined
4. **Faster**: Uses existing image as starting point

#### Parameters Explained

**`strength` (0.65)**

- Controls how much the image changes
- 0.0 = identical to input
- 1.0 = completely new image
- 0.65 = good balance (keeps layout, changes style)

**`guidance_scale` (7.5)**

- How closely AI follows the text prompt
- Low (1-5): More creative, less accurate
- High (10-20): More literal, less creative
- 7.5: Sweet spot for interior design

**`num_inference_steps` (30)**

- Number of denoising iterations
- More steps = better quality but slower
- 30 steps: Good quality in ~8 seconds (GPU)

### GPU Acceleration

**Why GPU Matters:**

```
CPU: 2-5 minutes per image
GPU: 8-10 seconds per image

15-40x faster!
```

**How it Works:**

- PyTorch detects CUDA-capable GPU
- Moves model tensors to GPU memory
- Parallel processing on thousands of cores
- Much faster matrix multiplications

**CPU Fallback:**

- Automatically uses CPU if no GPU detected
- Same quality, just slower
- Uses float32 instead of float16

---

## Budget Estimation System

### Rule-Based Approach

Instead of complex calculations, we use simple, transparent rules:

```python
BUDGET_ESTIMATES = {
    "Minimalist": 150000,  # Simple, clean design
    "Modern": 250000,      # Contemporary, higher-end
    "Vintage": 200000,     # Antique furnishings
    "Professional": 300000 # Office-grade quality
}
```

### Why Rule-Based?

1. **Transparency**: Easy to explain and justify
2. **Predictability**: Consistent estimates
3. **Customizable**: Easy to adjust for different markets
4. **No External Dependencies**: Works offline
5. **Academic Honesty**: Simple, understandable logic

### Budget Status Logic

```python
if estimated_cost <= user_budget:
    status = "within_budget"
    badge_color = "green"
else:
    status = "over_budget"
    badge_color = "red"
```

---

## Design Decisions

### 1. **Why FastAPI?**

- Modern, fast Python web framework
- Automatic API documentation
- Built-in data validation (Pydantic)
- Async support for future scaling
- Easy CORS configuration

### 2. **Why Vanilla JavaScript?**

- **Academic Integrity**: 100% original code
- **Simplicity**: No framework overhead
- **Control**: Full understanding of every line
- **Performance**: Minimal bundle size
- **Learning**: Better for understanding fundamentals

### 3. **Why Separate Frontend/Backend?**

- **Separation of Concerns**: Clear architecture
- **Independent Development**: Can work on each separately
- **Scalability**: Can deploy separately
- **Technology Freedom**: Can swap frontend/backend independently

### 4. **Why Offline-First?**

- **Accessibility**: Works on any hardware
- **Privacy**: No data sent to external services
- **Cost**: No API usage fees
- **Speed**: No network latency
- **Reliability**: No external service dependencies

### 5. **Why img2img over text2img?**

- **Preserves Layout**: Maintains room structure
- **More Realistic**: Based on actual room
- **Easier to Use**: No prompt engineering needed
- **Better Results**: User sees their room redesigned

### 6. **Why Stable Diffusion v1.5?**

- **Open Source**: Free to use
- **Well-Tested**: Mature, stable model
- **Hardware Efficient**: Runs on consumer GPUs
- **Good Quality**: Excellent for interior design
- **Offline Capable**: Can run completely locally

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Model loaded only on first request
2. **Attention Slicing**: Reduces GPU memory usage
3. **Half Precision (float16)**: Faster on GPU, less memory
4. **Image Resizing**: 512x512 optimal for speed/quality
5. **Caching**: Reuses uploaded images by hash

### Scalability

**Current Capacity:**

- Single request at a time
- Good for demo/development

**Future Improvements:**

- Queue system for multiple requests
- Redis caching for generated images
- Load balancing for multiple GPUs
- Batch processing for efficiency

---

## Security Considerations

1. **File Validation**: Only accepts image files
2. **Size Limits**: 10MB max upload
3. **CORS**: Restricts access to specific origins
4. **API Tokens**: Stored in .env, not committed to git
5. **Input Sanitization**: Pydantic validates all inputs

---

## Conclusion

This architecture provides:

- ✅ Clean separation of concerns
- ✅ Offline-first functionality
- ✅ GPU acceleration for performance
- ✅ Simple, understandable codebase
- ✅ Extensible design for future features
- ✅ Academic integrity (100% original)

The system successfully demonstrates full-stack development, AI/ML integration, and practical problem-solving for an MSc-level project.
