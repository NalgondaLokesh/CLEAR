# 🌤️ CLEAR - Cloud-Less Earth Observation & Reconstruction

An AI-powered cloud removal system for satellite imagery using U-Net GAN architecture with transfer learning on RICE datasets.

## 📋 Project Overview

CLEAR implements a deep learning solution for removing clouds from satellite images using Generative Adversarial Networks (GANs). The system uses a U-Net generator with skip connections and a PatchGAN discriminator, trained on the RICE1 and RICE2 datasets through a transfer learning approach.

### Key Features
- **U-Net GAN Architecture**: Generator with skip connections for precise image-to-image translation
- **Transfer Learning**: Pre-trained on RICE1, fine-tuned on RICE2 dataset
- **Real-time Inference**: Streamlit web interface for interactive cloud removal
- **High Performance**: Achieves competitive PSNR and SSIM metrics
- **Batch Processing**: Support for processing multiple images

## 🏗️ Architecture

### Model Components

**U-Net Generator (41.8M parameters)**
- Encoder: 6 downsampling convolutional blocks
- Bottleneck: Central processing layer
- Decoder: 6 upsampling blocks with skip connections
- Output: Tanh activation for final image generation

**PatchGAN Discriminator (2.8M parameters)**
- 5-layer convolutional network
- Patch-based discrimination for realistic texture generation
- Operates on concatenated cloudy and generated images

### Training Pipeline
- **Loss Functions**: BCE loss for adversarial training + L1 loss for pixel-level accuracy
- **Optimizers**: Adam with β=(0.5, 0.999)
- **Learning Rate**: 2e-4
- **L1 Lambda**: 100 for balancing adversarial and reconstruction losses

## 📊 Dataset

### RICE1 Dataset
- **Images**: 500 paired cloudy-clear images
- **Split**: 400 training, 100 testing
- **Structure**: 
  - `cloudy_image/` - Cloudy satellite images
  - `ground_truth/` - Corresponding clear images

### RICE2 Dataset
- **Images**: 736 paired images
- **Usage**: Transfer learning target dataset
- **Structure**:
  - `cloud/` - Cloudy images
  - `clear/` - Clear images

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- CUDA-capable GPU (recommended for training)
- 4GB+ GPU memory

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CLEAR
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Requirements
```
streamlit==1.28.0
torch==2.0.1
torchvision==0.15.2
Pillow==10.0.0
numpy==1.24.3
plotly==5.17.0
opencv-python==4.8.0.74
```

## 💻 Usage

### Running the Inference App

1. **Ensure models are available**: Place trained `.pth` files in the `models/` directory
   - `RICE1_Best.pth` (159.6 MB)
   - `RICE2_Best.pth` (159.6 MB)

2. **Launch the Streamlit app**:
```bash
streamlit run app.py
```

3. **Access the interface**: Open your browser to `http://localhost:8501`

4. **Use the app**:
   - Select a model from the sidebar
   - Upload a cloudy satellite image (PNG, JPG, JPEG)
   - Click "Remove Clouds" to process
   - Download the cloud-free result

### Training from Scratch

To train the model from scratch, use the provided Jupyter notebook:

```bash
jupyter notebook training_notebook/cloud_removal_project_pipeline.ipynb
```

**Training Stages**:
1. **Stage 1**: Train on RICE1 dataset (30 epochs)
2. **Stage 2**: Transfer learning on RICE2 dataset (20 epochs)
3. **Stage 3**: Inference and batch processing

**Training Configuration**:
- Batch size: 8 (training), 4 (testing)
- Image size: 256x256
- Epochs: 30 (RICE1), 20 (RICE2)
- Data augmentation: Enabled for training

## 📁 Project Structure

```
CLEAR/
├── app.py                          # Streamlit inference interface
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── models/                         # Trained model checkpoints
│   ├── RICE1_Best.pth             # Best model from RICE1 training
│   ├── RICE2_Best.pth             # Best model from RICE2 training
│   └── model_info.txt             # Model metadata
└── training_notebook/             # Training pipeline
    └── cloud_removal_project_pipeline.ipynb
```

## 📈 Performance

### Training Results

**RICE1 Dataset (30 epochs)**
- Best PSNR: ~25+ dB
- Best SSIM: ~0.68+
- Training samples: 400
- Test samples: 100

**RICE2 Dataset (20 epochs with transfer learning)**
- Improved performance on diverse cloud patterns
- Better generalization to new satellite imagery
- Batch processing capability for 736 images

### Metrics
- **PSNR (Peak Signal-to-Noise Ratio)**: Measures reconstruction quality
- **SSIM (Structural Similarity Index)**: Measures perceptual quality
- Processing time: ~1-2 seconds per image (GPU)

## 🔧 Model Architecture Details

### U-Net Generator
```python
class UNetGenerator(nn.Module):
    def __init__(self, in_channels=3, out_channels=3, ngf=64):
        # Encoder: 6 downsampling blocks
        # Bottleneck: Central processing
        # Decoder: 6 upsampling blocks with skip connections
        # Output: 3-channel RGB image
```

### Key Features
- **Skip Connections**: Preserve fine-grained spatial information
- **Dropout**: Applied in decoder (0.5) for regularization
- **Batch Normalization**: Stabilizes training
- **LeakyReLU/ReLU**: Activation functions for stability

## 🎯 Applications

- **Satellite Imagery Analysis**: Remove clouds for better analysis
- **Environmental Monitoring**: Clear views for change detection
- **Agricultural Assessment**: Monitor crop health through clouds
- **Disaster Response**: Quick assessment of affected areas
- **Urban Planning**: Clear imagery for development planning

## 📝 Training Process Summary

### Stage 1: RICE1 Training
1. Load and preprocess RICE1 dataset
2. Create train/test splits (80/20)
3. Initialize U-Net generator and PatchGAN discriminator
4. Train for 30 epochs with adversarial + L1 loss
5. Save best checkpoints based on PSNR

### Stage 2: Transfer Learning
1. Load best RICE1 model
2. Fine-tune on RICE2 dataset
3. Train for 20 epochs with lower learning rate
4. Save final models for inference

### Stage 3: Inference
1. Load trained model
2. Process single or batch images
3. Generate cloud-free outputs
4. Save results with metrics

## 🛠️ Technical Details

### Image Preprocessing
- Resize to 256x256 pixels
- Normalize to [-1, 1] range
- RGB color space
- Data augmentation for training (optional)

### Model Inference
```python
# Load model
model = UNetGenerator(in_channels=3, out_channels=3)
model.load_state_dict(torch.load('models/RICE1_Best.pth'))
model.eval()

# Process image
with torch.no_grad():
    output = model(preprocessed_image)
    result = denormalize(output)
```

## 🐛 Troubleshooting

### Common Issues

**Model not loading**
- Ensure `.pth` files are in the `models/` directory
- Check PyTorch version compatibility
- Verify file integrity (159.6 MB expected size)

**Out of memory errors**
- Reduce batch size in training
- Use smaller image dimensions
- Enable gradient checkpointing

**Poor output quality**
- Ensure input image is RGB format
- Check image resolution (256x256 optimal)
- Try different trained models (RICE1 vs RICE2)

## 📄 License

This project is developed for educational and research purposes. Please cite the original RICE dataset papers if used in research.

## 🙏 Acknowledgments

- **RICE Dataset**: Researchers who created the RICE1 and RICE2 datasets
- **PyTorch**: Deep learning framework
- **Streamlit**: Web interface framework
- **GAN Architecture**: Based on pix2pix and CycleGAN concepts

## 📞 Contact

For questions, issues, or contributions, please open an issue in the repository or contact the development team.

## 🔄 Version History

- **v1.0** (2026-08-16): Initial release of CLEAR
  - U-Net GAN implementation
  - RICE1 and RICE2 trained models
  - Streamlit web interface
  - Complete training pipeline

---

**Note**: CLEAR was developed as part of a cloud removal hackathon. The models are trained on specific satellite imagery datasets and may perform differently on other types of aerial or satellite images.#   C L E A R  
 