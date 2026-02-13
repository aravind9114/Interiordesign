# Backend Code Explained - Line by Line

This document provides a detailed explanation of every line of code in the backend, helping you understand exactly how the system works.

---

## Table of Contents

1. [main.py - API Server](#mainpy---api-server)
2. [config.py - Configuration](#configpy---configuration)
3. [providers/offline_diffusers.py - AI Generation](#providersoffline_diffuserspy---ai-generation)
4. [services/budget.py - Budget Estimation](#servicesbudgetpy---budget-estimation)
5. [services/storage.py - Image Handling](#servicesstoragepy---image-handling)
6. [services/logging.py - Logging Setup](#servicesloggingpy---logging-setup)

---

## main.py - API Server

This is the core of the backend - the FastAPI application that handles HTTP requests.

```python
# Line 1-3: Import statements
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
```

**Purpose**: Import required FastAPI components

- `FastAPI`: Main application class
- `UploadFile, File`: Handle file uploads
- `Form`: Extract form data from POST requests
- `HTTPException`: Return error responses
- `CORSMiddleware`: Allow cross-origin requests (frontend → backend)
- `StaticFiles`: Serve generated images

```python
# Line 4-5
from pathlib import Path
import time
```

**Purpose**: Additional utilities

- `Path`: Modern file path handling
- `time`: Measure generation time

```python
# Line 7-9
from config import settings
from services.logging import logger
from services.budget import estimate_cost, check_budget_status
```

**Purpose**: Import our custom modules

- `settings`: Configuration object from config.py
- `logger`: Logging function
- `estimate_cost, check_budget_status`: Budget calculation functions

```python
# Line 10-12
from services.storage import save_upload_image
from providers.offline_diffusers import OfflineDiffusersProvider
from providers.online_replicate import ReplicateProvider
from providers.online_hf_inference import HFInferenceProvider
```

**Purpose**: Import AI providers and storage

- `save_upload_image`: Saves uploaded files
- `OfflineDiffusersProvider`: Local GPU AI
- `ReplicateProvider`: Replicate API
- `HFInferenceProvider`: HuggingFace API

```python
# Line 15-18
# Create directories if they don't exist
Path(settings.upload_dir).mkdir(exist_ok=True)
Path(settings.generated_dir).mkdir(exist_ok=True)
```

**Purpose**: Ensure storage directories exist

- `mkdir(exist_ok=True)`: Create if missing, no error if exists
- Needed for saving uploaded and generated images

```python
# Line 20-27
# Initialize FastAPI app
app = FastAPI(
    title="Budget-Constrained AI Interior Design System",
    description="MSc Project - AI-based interior design with GPU acceleration",
    version="1.0.0"
)
```

**Purpose**: Create the FastAPI application

- `title`: Shown in auto-generated docs
- `description`: Project description
- `version`: API version

```python
# Line 29-41
# Configure CORS to allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",  # Simple HTTP server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://192.168.1.5:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

**Purpose**: Enable Cross-Origin Resource Sharing (CORS)

- **Why needed**: Browser security blocks requests from different origins
- `allow_origins`: List of allowed frontend URLs
- `allow_credentials`: Allow cookies
- `allow_methods`: Allow all HTTP methods (GET, POST, etc.)
- `allow_headers`: Allow all request headers
- `expose_headers`: Expose all response headers

```python
# Line 43-51
# Mount static files for serving generated images
app.mount(
    "/generated",
    StaticFiles(directory=settings.generated_dir),
    name="generated"
)
```

**Purpose**: Serve generated images as static files

- `/generated`: URL path
- Files in `settings.generated_dir` accessible at `http://localhost:8000/generated/filename.png`
- `name`: Internal reference name

```python
# Line 54-59
# Initialize AI providers
offline_provider = OfflineDiffusersProvider()
replicate_provider = ReplicateProvider()
hf_provider = HFInferenceProvider()
```

**Purpose**: Create instances of AI providers

- Offline provider loads Stable Diffusion model
- Online providers prepare API connections
- Created once at startup, reused for all requests

```python
# Line 62-65
@app.get("/")
async def root():
    return {"status": "online", "message": "Budget-Constrained AI Interior Design Backend"}
```

**Purpose**: Health check endpoint

- `@app.get("/")`: Handle GET requests to root URL
- `async def`: Asynchronous function (FastAPI handles it)
- Returns JSON with status info

```python
# Line 68-76
@app.post("/api/generate")
async def generate_design(
    image: UploadFile = File(...),
    room_type: str = Form(...),
    style: str = Form(...),
    budget: int = Form(...),
    provider: str = Form(...),
):
```

**Purpose**: Main API endpoint - receives generation requests

- `@app.post`: Handle POST requests
- `/api/generate`: URL path
- `async def`: Asynchronous function
- **Parameters** (all required, marked with `...`):
  - `image`: Uploaded file
  - `room_type`: String from form
  - `style`: String from form
  - `budget`: Integer from form
  - `provider`: String from form ("offline", "replicate", "hf")

```python
# Line 77-81
    logger.info("=== New generation request ===")
    logger.info(f"Provider: {provider}")
    logger.info(f"Room type: {room_type}")
    logger.info(f"Style: {style}")
    logger.info(f"Budget: {budget}")
```

**Purpose**: Log request details

- Helps debug and track requests
- Shows in terminal when running backend

```python
# Line 83-86
    # Validate provider
    if provider not in ["offline", "replicate", "hf"]:
        raise HTTPException(status_code=400, detail=f"Invalid provider: {provider}")
```

**Purpose**: Input validation

- Check provider is one of the three allowed values
- `HTTPException(400)`: Return HTTP 400 Bad Request if invalid
- Frontend shouldn't send invalid values, but good to check

```python
# Line 88-92
    # Validate image
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
```

**Purpose**: Validate uploaded file is actually an image

- `content_type`: MIME type (e.g., "image/jpeg", "image/png")
- Prevents users from uploading non-image files

```python
# Line 94-99
    # Save uploaded image
    try:
        image_path = await save_upload_image(image)
        logger.info(f"Saved upload: {image_path.name}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
```

**Purpose**: Save the uploaded image to disk

- `await`: Wait for async file operation to complete
- `save_upload_image`: Function from storage service
- Returns `Path` object pointing to saved file
- **Error handling**: If save fails, return HTTP 500 error

```python
# Line 101-103
    # Estimate cost based on style
    estimated_cost = estimate_cost(style)
    status = check_budget_status(estimated_cost, budget)
```

**Purpose**: Calculate budget estimation

- `estimate_cost(style)`: Look up cost for this design style
- `check_budget_status`: Compare estimated vs user's budget
- Returns "within_budget" or "over_budget"

```python
# Line 104-105
    logger.info(f"Estimated cost: {estimated_cost} | Budget: {budget} | Status: {status}")
```

**Purpose**: Log budget calculation result

```python
# Line 107-110
    # Generate design using selected provider
    start_time = time.time()
```

**Purpose**: Start timing the generation

- Used to show user how long it took

```python
# Line 112-129
    try:
        if provider == "offline":
            output_path, generation_time = offline_provider.generate_image(
                image_path, room_type, style
            )
        elif provider == "replicate":
            output_path, generation_time = replicate_provider.generate_image(
                image_path, room_type, style
            )
        elif provider == "hf":
            output_path, generation_time = hf_provider.generate_image(
                image_path, room_type, style
            )
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")
```

**Purpose**: Call the appropriate AI provider

- **If offline**: Use local GPU generation
- **If replicate**: Use Replicate API
- **If hf**: Use HuggingFace API
- Each provider returns:
  - `output_path`: Where generated image was saved
  - `generation_time`: How long it took
- **Error handling**:
  - `RuntimeError`: User error (e.g., missing API token) → HTTP 400
  - Other exceptions: Server error → HTTP 500

```python
# Line 131-133
    total_time = time.time() - start_time
    logger.info(f"✓ Generation complete in {total_time:.1f}s")
    logger.info("=== Request complete ===")
```

**Purpose**: Calculate total request time and log completion

- `total_time`: Full duration including all processing
- Shows in terminal

```python
# Line 135-146
    # Build response
    response = {
        "image_url": f"http://localhost:8000/generated/{output_path.name}",
        "estimated_cost": estimated_cost,
        "budget": budget,
        "status": status,
        "provider_used": provider,
        "time_taken_sec": round(generation_time, 2),
    }

    return response
```

**Purpose**: Create and return JSON response

- `image_url`: Full URL to access generated image
- `estimated_cost`: Cost estimate
- `budget`: User's budget (echoed back)
- `status`: "within_budget" or "over_budget"
- `provider_used`: Which provider was used
- `time_taken_sec`: Generation time rounded to 2 decimals
- FastAPI automatically converts dict to JSON response

---

## config.py - Configuration

Centralized settings for the entire backend.

```python
# Line 1-2
from pydantic_settings import BaseSettings
from pathlib import Path
```

**Purpose**: Import required modules

- `BaseSettings`: Pydantic class for settings with validation
- `Path`: Path handling

```python
# Line 5-6
class Settings(BaseSettings):
    """Application settings with environment variable support"""
```

**Purpose**: Define settings class

- Inherits from `BaseSettings`
- Automatically loads from environment variables or `.env` file

```python
# Line 8-9
    # API Tokens (optional, loaded from .env)
    replicate_api_token: str | None = None
    hf_api_token: str | None = None
```

**Purpose**: Optional API tokens for online providers

- `str | None`: Can be string or None (optional)
- `= None`: Default value if not provided
- Loaded from `.env` file if present

```python
# Line 11-13
    # Diffusers model configuration
    diffusers_model: str = "runwayml/stable-diffusion-v1-5"
```

**Purpose**: Which Stable Diffusion model to use

- HuggingFace model identifier
- v1.5 is stable and well-tested

```python
# Line 14-16
    image_width: int = 512
    image_height: int = 512
```

**Purpose**: Output image dimensions

- 512x512 is optimal for SD 1.5
- Larger is slower and uses more memory
- Smaller is faster but lower quality

```python
# Line 17
    num_inference_steps: int = 30
```

**Purpose**: Number of denoising steps

- More = better quality but slower
- 30 is good balance

```python
# Line 18
    guidance_scale: float = 7.5
```

**Purpose**: How closely to follow the prompt

- Higher = more literal
- 7.5 is standard default

```python
# Line 19
    img2img_strength: float = 0.65
```

**Purpose**: How much to change the input image

- 0.0 = no change
- 1.0 = completely new
- 0.65 = preserves layout, changes style

```python
# Line 21-23
    # Storage paths
    upload_dir: str = "uploads"
    generated_dir: str = "generated"
```

**Purpose**: Where to store images

- Relative paths from backend directory

```python
# Line 25-28
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
```

**Purpose**: Tell Pydantic where to find environment variables

- Looks for `.env` file in backend directory
- UTF-8 encoding for international characters

```python
# Line 31-36
# Budget estimation rules (₹)
BUDGET_ESTIMATES = {
    "Minimalist": 150000,
    "Modern": 250000,
    "Vintage": 200000,
    "Professional": 300000,
}
```

**Purpose**: Cost estimates for each design style

- Dictionary mapping style name to cost in Rupees
- Simple, transparent rules
- Easy to modify for different markets

```python
# Line 39
settings = Settings()
```

**Purpose**: Create single settings instance

- Loaded once when backend starts
- Imported by other modules

---

## providers/offline_diffusers.py - AI Generation

The heart of the AI - local Stable Diffusion generation.

```python
# Line 1-6
import torch
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image
from pathlib import Path
import uuid
import time
```

**Purpose**: Import dependencies

- `torch`: PyTorch deep learning library
- `StableDiffusionImg2ImgPipeline`: HuggingFace Diffusers img2img
- `PIL.Image`: Image processing
- `Path`: File paths
- `uuid`: Generate unique filenames
- `time`: Measure generation time

```python
# Line 8-9
from config import settings
from services.logging import logger
```

**Purpose**: Import our modules

- `settings`: Configuration
- `logger`: Logging function

```python
# Line 12-13
class OfflineDiffusersProvider:
    """Offline image generation using Stable Diffusion img2img"""
```

**Purpose**: Define provider class

- Encapsulates all offline AI logic

```python
# Line 15-17
    def __init__(self):
        self.pipeline = None
        self.device = None
```

**Purpose**: Constructor - initialize instance variables

- `self.pipeline`: Will hold the loaded model
- `self.device`: Will be "cuda" or "cpu"
- Set to `None` initially for lazy loading

```python
# Line 19-26
    def _load_model(self):
        """Lazy load the Stable Diffusion model"""
        if self.pipeline is not None:
            return
```

**Purpose**: Load model only when first needed (lazy loading)

- **Why lazy**: Model is ~4GB, takes time to load
- **Check**: If already loaded, return immediately
- Only loads once, reused for all subsequent requests

```python
# Line 28-34
        logger.info("Loading Stable Diffusion model...")

        # Detect if CUDA (GPU) is available
        if torch.cuda.is_available():
            self.device = "cuda"
            logger.info(f"✓ CUDA detected: {torch.cuda.get_device_name(0)}")
```

**Purpose**: Check for GPU availability

- `torch.cuda.is_available()`: Returns True if NVIDIA GPU with CUDA
- `get_device_name(0)`: Get name of first GPU (e.g., "RTX 4060")
- Log GPU info to console

```python
# Line 35-37
        else:
            self.device = "cpu"
            logger.warning("⚠ CUDA not available. Using CPU (will be slower).")
```

**Purpose**: Fallback to CPU if no GPU

- Still works, just 15-40x slower
- Warns user

```python
# Line 39-45
        # Load model
        self.pipeline = StableDiffusionImg2ImgPipeline.from_pretrained(
            settings.diffusers_model,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            safety_checker=None,
        )
```

**Purpose**: Load Stable Diffusion model from HuggingFace

- `from_pretrained`: Download if not cached, load if cached
- `settings.diffusers_model`: "runwayml/stable-diffusion-v1-5"
- `torch_dtype`:
  - `float16` for GPU (half precision, faster, less memory)
  - `float32` for CPU (full precision, required)
- `safety_checker=None`: Disable NSFW filter (not needed for interior design)

```python
# Line 47-48
        self.pipeline = self.pipeline.to(self.device)
```

**Purpose**: Move model to GPU or keep on CPU

- `.to("cuda")`: Transfers all model weights to GPU memory
- `.to("cpu")`: Keeps on CPU

```python
# Line 50-52
        if self.device == "cuda":
            self.pipeline.enable_attention_slicing()
```

**Purpose**: Memory optimization for GPU

- `enable_attention_slicing()`: Reduces VRAM usage
- Allows larger images or batch sizes
- Slight performance cost, worth it for consumer GPUs

```python
# Line 54
        logger.info(f"✓ Model loaded on {self.device}")
```

**Purpose**: Confirm model is ready

```python
# Line 56-62
    def _generate_prompt(self, room_type: str, style: str) -> str:
        """Generate automatic prompt based on room type and style"""
        prompt = (
            f"photorealistic {room_type.lower()} interior redesign, "
            f"{style.lower()} style, realistic lighting, high detail, "
            f"wide angle, interior design render"
        )
        return prompt
```

**Purpose**: Automatically create AI prompt

- **Why**: No user input needed
- **Format**: Descriptive, specific keywords
- **Example**: "photorealistic living room interior redesign, minimalist style, realistic lighting, high detail, wide angle, interior design render"
- Lowercase: More consistent results

```python
# Line 64-70
    def generate_image(self, image_path: Path, room_type: str, style: str):
        """
        Generate interior design using img2img
        Returns: (output_path, generation_time)
        """
```

**Purpose**: Main generation function

- Takes: uploaded image path, room type, style
- Returns: tuple of (where image saved, how long it took)

```python
# Line 72-73
        self._load_model()
```

**Purpose**: Ensure model is loaded

- First call: Loads model (~30 seconds)
- Subsequent calls: Returns immediately

```python
# Line 75-77
        logger.info(f"Processing image: {image_path.name}")
        start_time = time.time()
```

**Purpose**: Start processing

- Log which image
- Start timer

```python
# Line 79-81
        # Load and prepare input image
        init_image = Image.open(image_path).convert("RGB")
```

**Purpose**: Load uploaded image

- `Image.open()`: Read from disk
- `.convert("RGB")`: Ensure 3-channel color (no alpha)

```python
# Line 82-87
        # Resize to model's expected dimensions
        init_image = init_image.resize(
            (settings.image_width, settings.image_height),
            Image.Resampling.LANCZOS
        )
```

**Purpose**: Resize to 512x512

- SD 1.5 trained on 512x512 images
- `LANCZOS`: High-quality resampling algorithm
- Maintains aspect ratio distortion (user's room might change proportions)

```python
# Line 89-91
        # Generate prompt
        prompt = self._generate_prompt(room_type, style)
        logger.info(f"Prompt: {prompt}")
```

**Purpose**: Create prompt and log it

- Shows what we're asking the AI to do

```python
# Line 93
        logger.info("Generating image with Stable Diffusion...")
```

**Purpose**: Inform user generation starting

```python
# Line 95-105
        # Generate with img2img
        with torch.no_grad():
            output = self.pipeline(
                prompt=prompt,
                image=init_image,
                strength=settings.img2img_strength,
                guidance_scale=settings.guidance_scale,
                num_inference_steps=settings.num_inference_steps,
            )
```

**Purpose**: **THE AI GENERATION HAPPENS HERE**

- `with torch.no_grad()`: Don't track gradients (faster, less memory)
- `self.pipeline()`: Call the Stable Diffusion model
- **Parameters**:
  - `prompt`: Text description of what we want
  - `image`: Input image (user's room)
  - `strength=0.65`: How much to change (keeps layout, changes style)
  - `guidance_scale=7.5`: Follow prompt closely
  - `num_inference_steps=30`: Quality iterations
- **Result**: `output.images[0]` contains generated image

```python
# Line 107
        result_image = output.images[0]
```

**Purpose**: Extract generated image from result

- Pipeline returns list of images (we generate only 1)

```python
# Line 109-113
        # Save generated image
        output_filename = f"offline_{uuid.uuid4()}.png"
        output_path = Path(settings.generated_dir) / output_filename
        result_image.save(output_path)
```

**Purpose**: Save generated image

- `uuid.uuid4()`: Unique random ID (e.g., "a1b2c3d4-...")
- `output_filename`: "offline_a1b2c3d4-....png"
- `Path(...) / ...`: Combine directory and filename
- `.save()`: Write PNG to disk

```python
# Line 115-118
        generation_time = time.time() - start_time
        logger.info(f"✓ Image generated in {generation_time:.1f}s: {output_filename}")

        return output_path, generation_time
```

**Purpose**: Calculate time and return results

- `generation_time`: Total seconds
- Log success
- Return: (path to saved image, time taken)

---

## services/budget.py - Budget Estimation

Simple rule-based budget calculations.

```python
# Line 1-2
from config import BUDGET_ESTIMATES
```

**Purpose**: Import cost rules from config

```python
# Line 5-13
def estimate_cost(style: str) -> int:
    """
    Estimate cost based on design style
    Returns cost in Rupees
    """
    return BUDGET_ESTIMATES.get(style, 200000)
```

**Purpose**: Look up cost for a style

- `.get(style, 200000)`: Return cost for style, or 200000 if not found
- **Example**: `estimate_cost("Minimalist")` returns `150000`
- Simple dictionary lookup

```python
# Line 16-24
def check_budget_status(estimated_cost: int, user_budget: int) -> str:
    """
    Check if design is within budget
    Returns: "within_budget" or "over_budget"
    """
    if estimated_cost <= user_budget:
        return "within_budget"
    return "over_budget"
```

**Purpose**: Compare estimated vs actual budget

- **If** estimated ≤ user's budget → "within_budget"
- **Else** → "over_budget"
- Frontend uses this to show green/red badge

---

## services/storage.py - Image Handling

Manages saving and organizing images.

```python
# Line 1-5
from fastapi import UploadFile
from pathlib import Path
import uuid
import hashlib
```

**Purpose**: Import dependencies

- `UploadFile`: Type for uploaded files
- `Path`: File path handling
- `uuid`: Unique IDs
- `hashlib`: MD5 hashing (for caching)

```python
# Line 7-8
from config import settings
```

**Purpose**: Import settings

```python
# Line 11-20
async def save_upload_image(upload: UploadFile) -> Path:
    """
    Save uploaded image to disk
    Returns: Path to saved file
    """
```

**Purpose**: Save user's uploaded image

- `async`: Supports async file operations
- Takes: uploaded file
- Returns: path where saved

```python
# Line 22-25
    # Generate unique filename
    file_extension = upload.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
```

**Purpose**: Create unique filename

- `.split(".")[-1]`: Get file extension (e.g., "jpg")
- `uuid.uuid4()`: Random unique ID
- **Example**: "a1b2c3d4-e5f6-....jpg"

```python
# Line 26-27
    file_path = Path(settings.upload_dir) / unique_filename
```

**Purpose**: Build full path

- Combines directory ("uploads") with filename

```python
# Line 29-34
    # Save file
    with open(file_path, "wb") as f:
        content = await upload.read()
        f.write(content)
```

**Purpose**: Write file to disk

- `open(..., "wb")`: Open in write-binary mode
- `await upload.read()`: Read uploaded bytes (async)
- `f.write(content)`: Write to file

```python
# Line 36
    return file_path
```

**Purpose**: Return where file was saved

---

## services/logging.py - Logging Setup

Configures how logs are displayed.

```python
# Line 1
import logging
```

**Purpose**: Python's built-in logging

```python
# Line 4-12
def setup_logger():
    """Configure structured logging"""
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    return logging.getLogger(__name__)
```

**Purpose**: Set up logging format

- `level=logging.INFO`: Show INFO and above (INFO, WARNING, ERROR)
- `format`: How to display logs
  - **Example**: `[2026-02-12 09:52:13] [INFO] Generating image...`
- `datefmt`: Date format
- `getLogger(__name__)`: Create logger for this module

```python
# Line 15
logger = setup_logger()
```

**Purpose**: Create logger instance

- Used throughout backend: `logger.info("message")`

---

## Summary

The backend architecture:

1. **main.py**: Receives HTTP requests, orchestrates everything
2. **config.py**: Centralized settings
3. **providers/offline_diffusers.py**: The AI brain - generates designs
4. **services/budget.py**: Simple cost calculations
5. **services/storage.py**: File management
6. **services/logging.py**: Logging setup

**Key Flow**:

1. Request arrives at `/api/generate`
2. Save uploaded image
3. Estimate budget
4. Call AI provider to generate design
5. Save generated image
6. Return response with image URL and metadata

Every line works together to provide fast, reliable AI interior design generation!
