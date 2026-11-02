"""
FastAPI Routes for Cloud Removal API
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import base64
import io
from typing import Optional
import os
from dotenv import load_dotenv

from ..schemas.requests import HealthResponse, ModelsResponse, ProcessResponse
from ..models.model_loader import ModelLoader
from ..services.cloud_removal_service import CloudRemovalService

# Load environment variables
load_dotenv()

# Initialize router
router = APIRouter()

# Global model loader and service
model_loader = None
cloud_service = None


def initialize_services():
    """Initialize model loader and cloud removal service"""
    global model_loader, cloud_service
    
    model_path = os.getenv("MODEL_PATH", "./models")
    model_loader = ModelLoader(model_path)
    
    # Preload only RICE2 model
    model_config = {
        "RICE2": os.getenv("RICE2_MODEL", "RICE2_Best.pth")
    }
    model_loader.preload_models(model_config)
    
    # Initialize service
    cloud_service = CloudRemovalService(model_loader)


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    if model_loader is None:
        return HealthResponse(
            models_loaded=False,
            device="unknown"
        )
    
    device = str(model_loader.get_device())
    models_loaded = len(model_loader.models) > 0
    
    return HealthResponse(
        models_loaded=models_loaded,
        device=device
    )


@router.get("/models", response_model=ModelsResponse)
async def get_models():
    """Get available models"""
    if model_loader is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    
    # Return the model keys that are actually loaded (RICE1, RICE2)
    model_names = list(model_loader.models.keys())
    
    return ModelsResponse(
        models=model_names,
        active_model=model_names[0] if model_names else None
    )


@router.post("/process")
async def process_image(
    image: UploadFile = File(...),
    model: str = Form("RICE1")
):
    """Process image to remove clouds"""
    print(f"Received request - model: {model}, image: {image.filename}, content_type: {image.content_type}")
    
    if cloud_service is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    
    # Validate model
    print(f"Available models: {list(model_loader.models.keys())}")
    if model not in model_loader.models:
        raise HTTPException(
            status_code=400, 
            detail=f"Model {model} not available. Available models: {list(model_loader.models.keys())}"
        )
    
    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"File must be an image")
    
    try:
        # Read image data
        image_data = await image.read()
        
        # Process image
        result = cloud_service.process_image(image_data, model)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Convert processed image to base64
        processed_image_base64 = base64.b64encode(result["processed_image"]).decode('utf-8')
        
        return ProcessResponse(
            success=True,
            processed_image=processed_image_base64,
            metrics=result["metrics"],
            model_used=result["model_used"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@router.post("/batch-process")
async def batch_process_images(
    images: list[UploadFile] = File(...),
    model: str = Form("RICE1")
):
    """Process multiple images in batch"""
    if cloud_service is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    
    # Validate model
    if model not in model_loader.models:
        raise HTTPException(
            status_code=400, 
            detail=f"Model {model} not available"
        )
    
    results = []
    
    try:
        for image in images:
            if not image.content_type.startswith("image/"):
                results.append({
                    "filename": image.filename,
                    "success": False,
                    "error": "Invalid file type"
                })
                continue
            
            try:
                image_data = await image.read()
                result = cloud_service.process_image(image_data, model)
                
                if result["success"]:
                    processed_image_base64 = base64.b64encode(result["processed_image"]).decode('utf-8')
                    results.append({
                        "filename": image.filename,
                        "success": True,
                        "processed_image": processed_image_base64,
                        "metrics": result["metrics"]
                    })
                else:
                    results.append({
                        "filename": image.filename,
                        "success": False,
                        "error": result["error"]
                    })
                    
            except Exception as e:
                results.append({
                    "filename": image.filename,
                    "success": False,
                    "error": str(e)
                })
        
        return {"success": True, "results": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")