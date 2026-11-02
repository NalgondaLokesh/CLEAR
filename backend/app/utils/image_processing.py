"""
Image processing utilities
"""

import numpy as np
from PIL import Image
from typing import Tuple, Optional


def validate_image(image: Image.Image) -> Tuple[bool, Optional[str]]:
    """Validate image format and properties"""
    try:
        # Check if image is valid
        image.verify()
        return True, None
    except Exception as e:
        return False, f"Invalid image: {str(e)}"


def resize_image(image: Image.Image, target_size: Tuple[int, int] = (256, 256)) -> Image.Image:
    """Resize image to target size"""
    return image.resize(target_size, Image.Resampling.LANCZOS)


def normalize_image(image: np.ndarray) -> np.ndarray:
    """Normalize image to [0, 1] range"""
    if image.max() > 1.0:
        return image.astype(np.float32) / 255.0
    return image


def denormalize_image(image: np.ndarray) -> np.ndarray:
    """Denormalize image from [0, 1] to [0, 255] range"""
    if image.max() <= 1.0:
        return (image * 255).astype(np.uint8)
    return image.astype(np.uint8)


def calculate_psnr(img1: np.ndarray, img2: np.ndarray) -> float:
    """Calculate Peak Signal-to-Noise Ratio between two images"""
    mse = np.mean((img1 - img2) ** 2)
    if mse == 0:
        return float('inf')
    
    max_pixel = 255.0
    psnr = 20 * np.log10(max_pixel / np.sqrt(mse))
    return float(psnr)


def calculate_ssim(img1: np.ndarray, img2: np.ndarray) -> float:
    """Calculate Structural Similarity Index (simplified version)"""
    try:
        from skimage.metrics import structural_similarity as ssim
        
        # Convert to grayscale if needed
        if len(img1.shape) == 3:
            img1_gray = np.dot(img1[...,:3], [0.2989, 0.5870, 0.1140])
            img2_gray = np.dot(img2[...,:3], [0.2989, 0.5870, 0.1140])
        else:
            img1_gray = img1
            img2_gray = img2
        
        return float(ssim(img1_gray, img2_gray, data_range=img1_gray.max() - img1_gray.min()))
    except ImportError:
        # Fallback to simplified correlation if skimage not available
        return float(np.corrcoef(img1.flatten(), img2.flatten())[0, 1])