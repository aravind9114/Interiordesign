"""
Storage utilities for managing uploads and generated images.
"""
import hashlib
import uuid
from pathlib import Path
from PIL import Image
import io

from config import settings


def save_uploaded_image(image_data: bytes, filename: str) -> Path:
    """
    Save uploaded image to storage.
    
    Args:
        image_data: Image file bytes
        filename: Original filename
        
    Returns:
        Path to saved file
    """
    # Generate unique filename
    ext = Path(filename).suffix or ".jpg"
    unique_name = f"{uuid.uuid4()}{ext}"
    filepath = settings.uploads_dir / unique_name
    
    # Save image
    with open(filepath, "wb") as f:
        f.write(image_data)
    
    return filepath


def save_generated_image(image: Image.Image, prefix: str = "generated") -> Path:
    """
    Save generated image to storage.
    
    Args:
        image: PIL Image object
        prefix: Filename prefix
        
    Returns:
        Path to saved file
    """
    # Generate unique filename
    unique_name = f"{prefix}_{uuid.uuid4()}.png"
    filepath = settings.generated_dir / unique_name
    
    # Save as PNG for quality
    image.save(filepath, format="PNG", quality=95)
    
    return filepath


def compute_image_hash(image_path: Path) -> str:
    """
    Compute hash of an image file for caching.
    
    Args:
        image_path: Path to image file
        
    Returns:
        MD5 hash string
    """
    hasher = hashlib.md5()
    with open(image_path, "rb") as f:
        hasher.update(f.read())
    return hasher.hexdigest()


def get_cache_key(image_hash: str, style: str, room_type: str, provider: str) -> str:
    """
    Generate cache key for image generation results.
    
    Args:
        image_hash: Hash of input image
        style: Design style
        room_type: Room type
        provider: AI provider name
        
    Returns:
        Cache key string
    """
    return f"{image_hash}_{style}_{room_type}_{provider}"


def resize_image(image_path: Path, target_width: int = 512, target_height: int = 512) -> Image.Image:
    """
    Resize image to target dimensions while maintaining aspect ratio.
    
    Args:
        image_path: Path to image file
        target_width: Target width in pixels
        target_height: Target height in pixels
        
    Returns:
        Resized PIL Image
    """
    img = Image.open(image_path).convert("RGB")
    
    # Calculate aspect ratio
    aspect = img.width / img.height
    
    if aspect > 1:
        # Landscape
        new_width = target_width
        new_height = int(target_width / aspect)
    else:
        # Portrait or square
        new_height = target_height
        new_width = int(target_height * aspect)
    
    # Resize with high quality
    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Center crop to exact dimensions if needed
    if new_width != target_width or new_height != target_height:
        left = (new_width - target_width) // 2
        top = (new_height - target_height) // 2
        right = left + target_width
        bottom = top + target_height
        img = img.crop((left, top, right, bottom))
    
    return img
