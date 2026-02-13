"""
Offline AI provider using Diffusers image-to-image pipeline.
Runs locally with GPU acceleration when available.
"""
import torch
from PIL import Image
from pathlib import Path
import time

from diffusers import StableDiffusionImg2ImgPipeline
from config import settings, PROMPT_TEMPLATE, NEGATIVE_PROMPT
from services.logging import logger
from services.storage import resize_image, save_generated_image


class OfflineDiffusersProvider:
    """Offline image-to-image provider using Stable Diffusion."""
    
    def __init__(self):
        self.pipeline = None
        self.device = None
        
    def initialize(self):
        """Initialize the Stable Diffusion pipeline (lazy loading)."""
        if self.pipeline is not None:
            return  # Already initialized
        
        logger.info("Initializing offline Diffusers provider...")
        
        # Detect device
        if torch.cuda.is_available():
            self.device = "cuda"
            logger.info(f"✓ CUDA detected: {torch.cuda.get_device_name(0)}")
        else:
            self.device = "cpu"
            logger.warning("⚠ CUDA not available. Using CPU (will be slower).")
        
        # Load pipeline
        logger.info(f"Loading model: {settings.diffusers_model}")
        logger.info("This may take a few minutes on first run (downloading ~4GB)...")
        
        self.pipeline = StableDiffusionImg2ImgPipeline.from_pretrained(
            settings.diffusers_model,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            safety_checker=None,  # Disable for faster inference
        )
        
        self.pipeline = self.pipeline.to(self.device)
        
        # Enable optimizations
        if self.device == "cuda":
            # Enable attention slicing for lower VRAM usage
            self.pipeline.enable_attention_slicing()
        
        logger.info("✓ Model loaded successfully!")
    
    def generate_prompt(self, room_type: str, style: str) -> tuple[str, str]:
        """
        Generate prompt and negative prompt based on parameters.
        
        Args:
            room_type: Type of room (e.g., "Living Room")
            style: Design style (e.g., "Modern")
            
        Returns:
            Tuple of (prompt, negative_prompt)
        """
        prompt = PROMPT_TEMPLATE.format(
            room_type=room_type.lower(),
            style=style.lower()
        )
        return prompt, NEGATIVE_PROMPT
    
    def generate_image(
        self,
        image_path: Path,
        room_type: str,
        style: str
    ) -> tuple[Path, float]:
        """
        Generate redesigned interior image.
        
        Args:
            image_path: Path to input image
            room_type: Type of room
            style: Design style
            
        Returns:
            Tuple of (output_image_path, time_taken_seconds)
        """
        # Initialize pipeline if needed
        self.initialize()
        
        start_time = time.time()
        
        # Load and resize input image
        logger.info(f"Processing image: {image_path.name}")
        init_image = resize_image(
            image_path,
            settings.image_width,
            settings.image_height
        )
        
        # Generate prompts
        prompt, negative_prompt = self.generate_prompt(room_type, style)
        logger.info(f"Prompt: {prompt}")
        
        # Run inference
        logger.info("Generating image with Stable Diffusion...")
        with torch.no_grad():
            result = self.pipeline(
                prompt=prompt,
                negative_prompt=negative_prompt,
                image=init_image,
                strength=settings.img2img_strength,
                num_inference_steps=settings.num_inference_steps,
                guidance_scale=settings.guidance_scale,
            )
        
        # Save generated image
        output_image = result.images[0]
        output_path = save_generated_image(output_image, prefix="offline")
        
        time_taken = time.time() - start_time
        logger.info(f"✓ Image generated in {time_taken:.1f}s: {output_path.name}")
        
        return output_path, time_taken


# Global provider instance (singleton)
offline_provider = OfflineDiffusersProvider()
