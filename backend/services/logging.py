"""
Logging configuration for the backend.
"""
import logging
import sys
from datetime import datetime


def setup_logging():
    """Configure structured logging for the application."""
    
    # Create logger
    logger = logging.getLogger("interior_designer_ai")
    logger.setLevel(logging.INFO)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler with formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    
    # Format: [timestamp] [level] message
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    
    return logger


# Global logger instance
logger = setup_logging()
