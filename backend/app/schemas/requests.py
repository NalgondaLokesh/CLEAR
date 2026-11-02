"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any


class HealthResponse(BaseModel):
    """Health check response"""
    models_loaded: bool
    device: str


class ModelsResponse(BaseModel):
    """Available models response"""
    models: list
    active_model: Optional[str] = None


class ProcessResponse(BaseModel):
    """Image processing response"""
    success: bool
    processed_image: Optional[str] = None  # Base64 encoded
    metrics: Optional[Dict[str, Any]] = None
    model_used: Optional[str] = None
    error: Optional[str] = None

    class Config:
        protected_namespaces = ()


class BatchProcessResponse(BaseModel):
    """Batch processing response"""
    success: bool
    results: Optional[list] = None
    error: Optional[str] = None