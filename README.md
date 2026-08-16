# 🌤️ CLEAR - Cloud-Less Earth Observation & Reconstruction

An AI-powered cloud removal system for satellite imagery using U-Net GAN architecture with transfer learning on RICE datasets.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Dataset](#dataset)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Performance](#performance)
- [Applications](#applications)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 📋 Project Overview

CLEAR implements a deep learning solution for removing clouds from satellite images using Generative Adversarial Networks (GANs). The system uses a U-Net generator with skip connections and a PatchGAN discriminator, trained on the RICE1 and RICE2 datasets through a transfer learning approach.

### Key Features

- **🏗️ U-Net GAN Architecture**: Generator with skip connections for precise image-to-image translation
- **🔄 Transfer Learning**: Pre-trained on RICE1, fine-tuned on RICE2 dataset
- **⚡ Real-time Inference**: Streamlit web interface for interactive cloud removal
- **📈 High Performance**: Achieves competitive PSNR and SSIM metrics
- **📦 Batch Processing**: Support for processing multiple images

---

## 🏗️ Architecture

### Model Components

#### U-Net Generator (41.8M parameters)
- **Encoder**: 6 downsampling convolutional blocks
- **Bottleneck**: Central processing layer
- **Decoder**: 6 upsampling blocks with skip connections
- **Output**: Tanh activation for final image generation

#### PatchGAN Discriminator (2.8M parameters)
- 5-layer convolutional network
- Patch-based discrimination for realistic texture generation
- Operates on concatenated cloudy and generated images

### Training Pipeline

| Component | Configuration |
|-----------|---------------|
| **Loss Functions** | BCE loss for adversarial training + L1 loss for pixel-level accuracy |
| **Optimizers** | Adam with β=(0.5, 0.999) |
| **Learning Rate** | 2e-4 |
| **L1 Lambda** | 100 for balancing adversarial and reconstruction losses |

---

## 📊 Dataset

### Dataset Download

The RICE datasets used for training can be downloaded from:
**[Google Drive - RICE Datasets](https://drive.google.com/drive/folders/1qlAi-33iSQyhBXHumpQQRv_ojq67JkqQ?usp=drive_link)**

### Dataset Details

#### RICE1 Dataset
- **Images**: 500 paired cloudy-clear images
- **Split**: 400 training, 100 testing
- **Structure**:
  - `cloudy_image/` - Cloudy satellite images
  - `ground_truth/` - Corresponding clear images

#### RICE2 Dataset
- **Images**: 736 paired images
- **Usage**: Transfer learning target dataset
- **Structure**:
  - `cloud/` - Cloudy images
  - `clear/` - Clear images

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- CUDA-capable GPU (recommended for training)
- 4GB+ GPU memory

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NalgondaLokesh/CLEAR.git
   cd CLEAR
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download Model Weights** (Required for inference)
   - Model files are managed via Git LFS and will be downloaded automatically
   - Or manually download from the repository's `models/` directory
   - Required files:
     - `RICE1_Best.pth` (159.6 MB)
     - `RICE2_Best.pth` (159.6 MB)

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

---

## 💻 Usage

### Running the Inference App

1. **Ensure models are available**
   - Place trained `.pth` files in the `models/` directory
   - Files should be named: `RICE1_Best.pth` and `RICE2_Best.pth`

2. **Launch the Streamlit app**
   ```bash
   streamlit run app.py
   ```

3. **Access the interface**
   - Open your browser to `http://localhost:8501`

4. **Use the app**
   - Select a model from the sidebar (RICE1 or RICE2)
   - Upload a cloudy satellite image (PNG, JPG, JPEG)
   - Click "Remove Clouds" to process
   - Download the cloud-free result

### Training from Scratch

To train the model from scratch, use the provided Jupyter notebook:

```bash
jupyter notebook training_notebook/cloud_removal_project_pipeline.ipynb
```

#### Training Stages

1. **Stage 1**: Train on RICE1 dataset (30 epochs)
2. **Stage 2**: Transfer learning on RICE2 dataset (20 epochs)
3. **Stage 3**: Inference and batch processing

#### Training Configuration

| Parameter | Value |
|-----------|-------|
| **Batch Size** | 8 (training), 4 (testing) |
| **Image Size** | 256×256 |
| **Epochs** | 30 (RICE1), 20 (RICE2) |
| **Data Augmentation** | Enabled for training |

---

## 📁 Project Structure

```
CLEAR/
├── app.py                          # Streamlit inference interface
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── .gitignore                      # Git ignore rules
├── .gitattributes                  # Git LFS configuration
├── models/                         # Trained model checkpoints
│   ├── RICE1_Best.pth             # Best model from RICE1 training
│   ├── RICE2_Best.pth             # Best model from RICE2 training
│   └── model_info.txt             # Model metadata
└── training_notebook/             # Training pipeline
    └── cloud_removal_project_pipeline.ipynb
```

---

## 📈 Performance

### Training Results

#### RICE1 Dataset (30 epochs)
- **Best PSNR**: ~25+ dB
- **Best SSIM**: ~0.68+
- **Training samples**: 400
- **Test samples**: 100

#### RICE2 Dataset (20 epochs with transfer learning)
- **Performance**: Improved on diverse cloud patterns
- **Generalization**: Better on new satellite imagery
- **Processing**: Batch capability for 736 images

### Metrics

| Metric | Description | Typical Value |
|--------|-------------|---------------|
| **PSNR** | Peak Signal-to-Noise Ratio | 25+ dB |
| **SSIM** | Structural Similarity Index | 0.68+ |
| **Processing Time** | GPU inference time | 1-2 seconds/image |

---

## 🎯 Applications

- **🛰️ Satellite Imagery Analysis**: Remove clouds for better analysis
- **🌍 Environmental Monitoring**: Clear views for change detection
- **🌾 Agricultural Assessment**: Monitor crop health through clouds
- **🚨 Disaster Response**: Quick assessment of affected areas
- **🏗️ Urban Planning**: Clear imagery for development planning

---

## 🛠️ Technical Details

### Image Preprocessing

- Resize to 256×256 pixels
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

---

## 🐛 Troubleshooting

### Common Issues

#### Model not loading
- **Solution**: Ensure `.pth` files are in the `models/` directory
- **Check**: PyTorch version compatibility
- **Verify**: File integrity (159.6 MB expected size)

#### Out of memory errors
- **Solution**: Reduce batch size in training
- **Alternative**: Use smaller image dimensions
- **Option**: Enable gradient checkpointing

#### Poor output quality
- **Check**: Input image is RGB format
- **Verify**: Image resolution (256×256 optimal)
- **Try**: Different trained models (RICE1 vs RICE2)

---

## 📄 License

This project is developed for educational and research purposes. Please cite the original RICE dataset papers if used in research.

---

## 🙏 Acknowledgments

- **RICE Dataset**: Researchers who created the RICE1 and RICE2 datasets
- **PyTorch**: Deep learning framework
- **Streamlit**: Web interface framework
- **GAN Architecture**: Based on pix2pix and CycleGAN concepts

---

## 📞 Contact

For questions, issues, or contributions, please open an issue in the repository or contact the development team.

---

## 🔄 Version History

### v1.0 (2026-08-16)
- ✅ U-Net GAN implementation
- ✅ RICE1 and RICE2 trained models
- ✅ Streamlit web interface with enhanced UI/UX
- ✅ Complete training pipeline
- ✅ Git LFS integration for large model files
- ✅ Comprehensive documentation

---

**Note**: CLEAR was developed as part of a cloud removal hackathon. The models are trained on specific satellite imagery datasets and may perform differently on other types of aerial or satellite images.