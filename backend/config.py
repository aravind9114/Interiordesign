"""
Configuration file for the FastAPI backend.
Handles environment variables and app settings.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Tokens (optional for online providers)
    replicate_api_token: str | None = None
    hf_api_token: str | None = None
    
    # Storage paths
    base_dir: Path = Path(__file__).parent
    storage_dir: Path = base_dir / "storage"
    uploads_dir: Path = storage_dir / "uploads"
    generated_dir: Path = storage_dir / "generated"
    
    # Model configuration
    diffusers_model: str = "runwayml/stable-diffusion-v1-5"
    image_width: int = 512
    image_height: int = 512
    num_inference_steps: int = 30
    guidance_scale: float = 7.5
    img2img_strength: float = 0.65
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


# Global settings instance
settings = Settings()

# Ensure storage directories exist
settings.uploads_dir.mkdir(parents=True, exist_ok=True)
settings.generated_dir.mkdir(parents=True, exist_ok=True)


# Prompt templates
PROMPT_TEMPLATE = (
    "photorealistic {room_type} interior redesign, {style} style, "
    "realistic lighting, high detail, wide angle, interior design render"
)

NEGATIVE_PROMPT = (
    "low quality, distorted, blurry, cartoon, sketch, deformed, "
    "bad anatomy, disfigured, poorly drawn, extra limbs"
)

# Budget estimation rules (based on style)
BUDGET_ESTIMATES = {
    "Minimalist": 150000,
    "Modern": 250000,
    "Vintage": 200000,
    "Professional": 300000,
}
