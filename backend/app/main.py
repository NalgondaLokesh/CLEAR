"""
Main FastAPI Application for CLEAR Cloud Removal Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from .api.routes import router, initialize_services
from .schemas.requests import HealthResponse

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    try:
        initialize_services()
        print("✅ Services initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing services: {str(e)}")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down services...")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="CLEAR Cloud Removal API",
    description="AI-powered cloud removal for satellite imagery using U-Net GAN",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["cloud-removal"])


@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "CLEAR Cloud Removal API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "health": "/api/health",
            "models": "/api/models",
            "process": "/api/process",
            "batch-process": "/api/batch-process"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    from .api.routes import model_loader
    
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


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal server error: {str(exc)}",
            "type": type(exc).__name__
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True
    )