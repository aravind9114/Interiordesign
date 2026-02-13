"""
FastAPI Backend for Budget-Constrained Interior Design AI System.

Main application entry point with API endpoints and static file serving.
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pathlib import Path
import time

from config import settings
from services.logging import logger
from services.storage import save_uploaded_image
from services.budget import estimate_cost, check_budget_status
from providers.offline_diffusers import offline_provider
from providers.online_replicate import replicate_provider
from providers.online_hf_inference import hf_provider
from ai.detector_yolo import YOLODetector
from services.replacement_engine import ReplacementEngine
from services.vendor_links import VendorLinks



# Create FastAPI app
app = FastAPI(
    title="Budget-Constrained Interior Design AI",
    description="AI-powered interior design with offline and online providers",
    version="1.0.0"
)

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

# Mount static file serving for generated images (after CORS middleware)
app.mount(
    "/generated",
    StaticFiles(directory=str(settings.generated_dir)),
    name="generated"
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "running",
        "message": "Budget-Constrained Interior Design AI Backend",
        "version": "1.0.0"
    }


@app.post("/api/generate")
async def generate_design(
    image: UploadFile = File(...),
    room_type: str = Form(...),
    style: str = Form(...),
    budget: int = Form(...),
    provider: str = Form(...),
):
    """
    Generate interior design based on uploaded image and parameters.
    
    Args:
        image: Uploaded room image
        room_type: Type of room (Living Room, Bedroom, etc.)
        style: Design style (Modern, Vintage, Minimalist, Professional)
        budget: User's budget in currency units
        provider: AI provider to use (offline, replicate, hf)
        
    Returns:
        JSON response with generated image URL and budget information
    """
    start_time = time.time()
    
    try:
        # Log request
        logger.info(f"=== New generation request ===")
        logger.info(f"Provider: {provider}")
        logger.info(f"Room type: {room_type}")
        logger.info(f"Style: {style}")
        logger.info(f"Budget: {budget}")
        
        # Validate provider
        if provider not in ["offline", "replicate", "hf"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid provider: {provider}. Must be 'offline', 'replicate', or 'hf'"
            )
        
        # Save uploaded image
        image_data = await image.read()
        if not image_data:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        image_path = save_uploaded_image(image_data, image.filename or "upload.jpg")
        logger.info(f"Saved upload: {image_path.name}")
        
        # Estimate cost
        estimated_cost = estimate_cost(style)
        budget_status = check_budget_status(estimated_cost, budget)
        logger.info(f"Estimated cost: {estimated_cost} | Budget: {budget} | Status: {budget_status}")
        
        # Generate image based on provider
        output_path = None
        generation_time = 0.0
        
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
            # Provider configuration error
            error_message = str(e)
            logger.error(f"Provider error: {error_message}")
            raise HTTPException(status_code=400, detail=error_message)
        
        except Exception as e:
            # Generation error
            logger.error(f"Generation failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate image: {str(e)}"
            )
        
        # Build response
        total_time = time.time() - start_time
        image_url = f"http://localhost:{settings.port}/generated/{output_path.name}"
        
        response = {
            "image_url": image_url,
            "provider_used": provider,
            "estimated_cost": estimated_cost,
            "budget": budget,
            "status": budget_status,
            "time_taken_sec": round(generation_time, 2),
            "total_time_sec": round(total_time, 2),
        }
        
        logger.info(f"✓ Generation complete in {total_time:.1f}s")
        logger.info(f"=== Request complete ===\n")
        
        return JSONResponse(content=response, status_code=200)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Extended health check with system information."""
    import torch
    
    cuda_available = torch.cuda.is_available()
    cuda_device = torch.cuda.get_device_name(0) if cuda_available else "N/A"
    
    return {
        "status": "healthy",
        "cuda_available": cuda_available,
        "cuda_device": cuda_device,
        "offline_provider": "ready",
        "replicate_configured": settings.replicate_api_token is not None,
        "hf_configured": settings.hf_api_token is not None,
    }


# Initialize detection services (singleton)
yolo_detector = YOLODetector()
replacement_engine = ReplacementEngine()
vendor_links = VendorLinks()


@app.post("/vision/detect")
async def detect_furniture(
    image: UploadFile = File(...),
    budget: int = Form(...),
):
    """Detect furniture and suggest replacements."""
    logger.info("=== Furniture Detection Request ===")
    logger.info(f"Budget: {budget}")
    
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await image.read()
        image_path = save_uploaded_image(image_data, image.filename)
        logger.info(f"Saved upload: {image_path.name}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    try:
        detections = yolo_detector.detect_furniture(image_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")
    
    try:
        suggestions, remaining_budget = replacement_engine.suggest_replacements(detections, budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestion generation failed: {str(e)}")
    
    # Get online suggestions for each detected category using vendor directory
    online_suggestions = {}
    for detection in detections:
        category = detection["category"]
        if category not in online_suggestions:
            try:
                online_suggestions[category] = vendor_links.get_vendor_links(category)
                logger.info(f"✓ Loaded {len(online_suggestions[category]['results'])} vendor links for {category}")
            except Exception as e:
                logger.warning(f"Vendor links failed for {category}: {e}")
                online_suggestions[category] = {"results": [], "cache": "error", "latency_ms": 0}
    
    logger.info(f"✓ Detection complete: {len(detections)} items, {len(suggestions)} suggestions")
    logger.info("=== Request Complete ===")
    
    return {
        "detections": detections,
        "suggestions": suggestions,
        "online_suggestions": online_suggestions,
        "remaining_budget": remaining_budget
    }


if __name__ == "__main__":

    import uvicorn
    
    logger.info("Starting Budget-Constrained Interior Design AI Backend")
    logger.info(f"Server: http://{settings.host}:{settings.port}")
    logger.info(f"Health check: http://localhost:{settings.port}/health")
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
