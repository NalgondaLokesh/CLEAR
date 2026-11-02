# CLEAR Backend API

FastAPI backend for AI-powered cloud removal from satellite imagery.

## Features

- 🚀 FastAPI with async support
- 🧠 PyTorch-based U-Net GAN model
- 📊 Real-time image processing
- 🔧 RESTful API endpoints
- 🛡️ CORS support for frontend integration
- 💾 Model caching for performance

## Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
Edit `.env` file:
```
MODEL_PATH=./models
RICE1_MODEL=RICE1_Best.pth
RICE2_MODEL=RICE2_Best.pth
MAX_IMAGE_SIZE=1024
CUDA_DEVICE=0
API_HOST=0.0.0.0
API_PORT=8000
```

3. **Ensure model files are in place:**
```
backend/models/
├── RICE1_Best.pth
└── RICE2_Best.pth
```

## Running the Server

### Development mode:
```bash
cd backend
python -m app.main
```

### Production mode:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "device": "cuda"
}
```

### Get Available Models
```
GET /api/models
```
Response:
```json
{
  "models": ["RICE1", "RICE2"],
  "active_model": "RICE1"
}
```

### Process Image
```
POST /api/process
Content-Type: multipart/form-data

image: <file>
model: "RICE1" | "RICE2"
```
Response:
```json
{
  "success": true,
  "processed_image": "base64_encoded_image",
  "metrics": {
    "psnr": 25.0,
    "ssim": 0.68,
    "processing_time": 1.23,
    "output_size": "256x256"
  },
  "model_used": "RICE1"
}
```

### Batch Process Images
```
POST /api/batch-process
Content-Type: multipart/form-data

images: [<file1>, <file2>, ...]
model: "RICE1" | "RICE2"
```
Response:
```json
{
  "success": true,
  "results": [
    {
      "filename": "image1.jpg",
      "success": true,
      "processed_image": "base64_encoded_image",
      "metrics": { ... }
    }
  ]
}
```

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── api/
│   │   └── routes.py        # API endpoints
│   ├── models/
│   │   ├── unet_generator.py    # U-Net model architecture
│   │   └── model_loader.py       # Model loading and caching
│   ├── services/
│   │   └── cloud_removal_service.py  # Image processing logic
│   ├── schemas/
│   │   └── requests.py       # Pydantic schemas
│   └── utils/
│       └── image_processing.py  # Image utilities
├── models/                  # Model weights
│   ├── RICE1_Best.pth
│   └── RICE2_Best.pth
├── requirements.txt
└── .env
```

## Model Information

- **Architecture**: U-Net Generator with skip connections
- **Parameters**: 41.8M (generator)
- **Input Size**: 256×256 RGB images
- **Output Size**: 256×256 RGB images
- **Training Data**: RICE1 and RICE2 datasets

## Performance

- **Processing Time**: 1-2 seconds per image (GPU)
- **Supported Formats**: PNG, JPG, JPEG
- **Max File Size**: 10MB (configurable)

## Troubleshooting

### Model not loading
- Ensure `.pth` files are in the `models/` directory
- Check PyTorch version compatibility
- Verify CUDA availability if using GPU

### Out of memory errors
- Reduce batch size
- Use smaller image dimensions
- Enable gradient checkpointing

### CORS errors
- Check CORS configuration in `main.py`
- Verify frontend origin is allowed

## Development

### Adding new models
1. Place model file in `models/` directory
2. Update `.env` with model filename
3. Add model to configuration in `app/main.py`

### Testing endpoints
```bash
# Health check
curl http://localhost:8000/api/health

# Get models
curl http://localhost:8000/api/models

# Process image
curl -X POST http://localhost:8000/api/process \
  -F "image=@test.jpg" \
  -F "model=RICE1"
```

## License

This project is developed for educational and research purposes.