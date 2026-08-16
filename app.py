"""
🌤️ CLEAR - Cloud-Less Earth Observation & Reconstruction
Simple inference-only cloud removal for satellite imagery
"""

import streamlit as st
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import numpy as np
import os
import time
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="CLEAR - Cloud Removal",
    page_icon="🌤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    /* Global Styles */
    .main {
        background-color: #f8f9fa;
    }
    
    /* Header Styles */
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .sub-header {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c3e50;
        margin-top: 1rem;
    }
    
    /* Info Boxes */
    .info-box {
        background: linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%);
        padding: 1.2rem;
        border-radius: 0.75rem;
        border-left: 4px solid #1f77b4;
        margin: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .success-box {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        padding: 1.2rem;
        border-radius: 0.75rem;
        border-left: 4px solid #28a745;
        margin: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .warning-box {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
        padding: 1.2rem;
        border-radius: 0.75rem;
        border-left: 4px solid #ffc107;
        margin: 1rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Metric Cards */
    .metric-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        padding: 1.5rem;
        border-radius: 0.75rem;
        text-align: center;
        border: 1px solid #dee2e6;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }
    
    /* Upload Area */
    .upload-area {
        border: 2px dashed #1f77b4;
        border-radius: 0.75rem;
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        transition: all 0.3s;
    }
    
    .upload-area:hover {
        border-color: #667eea;
        background: linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%);
    }
    
    /* Button Styles */
    .stButton>button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 0.5rem;
        padding: 0.75rem 2rem;
        font-weight: bold;
        transition: all 0.3s;
        border: none;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stButton>button:hover {
        background: linear-gradient(135deg, #5568d3 0%, #653d91 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.15);
    }
    
    .stButton>button:active {
        transform: translateY(0);
    }
    
    .stDownloadButton>button {
        background: linear-gradient(135deg, #28a745 0%, #218838 100%);
        color: white;
        border-radius: 0.5rem;
        padding: 0.75rem 2rem;
        font-weight: bold;
        border: none;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stDownloadButton>button:hover {
        background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.15);
    }
    
    /* Progress Bar */
    .stProgress > div > div > div {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    /* File Uploader */
    .stFileUploader {
        border: 2px dashed #667eea;
        border-radius: 0.75rem;
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    /* Sidebar */
    .css-1d391kg {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Expander */
    .streamlit-expanderHeader {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 0.5rem;
        padding: 0.5rem;
    }
    
    /* Animation */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    /* Tooltip */
    .tooltip {
        position: relative;
        display: inline-block;
    }
    
    .tooltip .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
</style>
""", unsafe_allow_html=True)

# ============================================
# MODEL ARCHITECTURE (Same as training)
# ============================================

class ConvBlock(nn.Module):
    def __init__(self, in_channels, out_channels, down=True, use_norm=True, dropout=0.0):
        super().__init__()
        if down:
            self.conv = nn.Conv2d(in_channels, out_channels, 4, 2, 1, bias=not use_norm)
        else:
            self.conv = nn.ConvTranspose2d(in_channels, out_channels, 4, 2, 1, bias=not use_norm)
        
        layers = [self.conv]
        if use_norm:
            layers.append(nn.BatchNorm2d(out_channels))
        if dropout > 0:
            layers.append(nn.Dropout(dropout))
        layers.append(nn.LeakyReLU(0.2, True) if down else nn.ReLU(True))
        self.block = nn.Sequential(*layers)
    
    def forward(self, x):
        return self.block(x)

class UNetGenerator(nn.Module):
    def __init__(self, in_channels=3, out_channels=3, ngf=64):
        super().__init__()
        
        self.down1 = ConvBlock(in_channels, ngf, down=True, use_norm=False)
        self.down2 = ConvBlock(ngf, ngf * 2, down=True)
        self.down3 = ConvBlock(ngf * 2, ngf * 4, down=True)
        self.down4 = ConvBlock(ngf * 4, ngf * 8, down=True)
        self.down5 = ConvBlock(ngf * 8, ngf * 8, down=True)
        self.down6 = ConvBlock(ngf * 8, ngf * 8, down=True)
        
        self.bottleneck = nn.Sequential(
            nn.Conv2d(ngf * 8, ngf * 8, 4, 2, 1),
            nn.ReLU(True)
        )
        
        self.up1 = ConvBlock(ngf * 8, ngf * 8, down=False, dropout=0.5)
        self.up2 = ConvBlock(ngf * 16, ngf * 8, down=False, dropout=0.5)
        self.up3 = ConvBlock(ngf * 16, ngf * 8, down=False, dropout=0.5)
        self.up4 = ConvBlock(ngf * 16, ngf * 4, down=False)
        self.up5 = ConvBlock(ngf * 8, ngf * 2, down=False)
        self.up6 = ConvBlock(ngf * 4, ngf, down=False)
        
        self.final = nn.Sequential(
            nn.ConvTranspose2d(ngf * 2, out_channels, 4, 2, 1),
            nn.Tanh()
        )
    
    def forward(self, x):
        d1 = self.down1(x)
        d2 = self.down2(d1)
        d3 = self.down3(d2)
        d4 = self.down4(d3)
        d5 = self.down5(d4)
        d6 = self.down6(d5)
        
        b = self.bottleneck(d6)
        
        u1 = torch.cat([self.up1(b), d6], 1)
        u2 = torch.cat([self.up2(u1), d5], 1)
        u3 = torch.cat([self.up3(u2), d4], 1)
        u4 = torch.cat([self.up4(u3), d3], 1)
        u5 = torch.cat([self.up5(u4), d2], 1)
        u6 = torch.cat([self.up6(u5), d1], 1)
        
        return self.final(u6)

# ============================================
# MODEL LOADING
# ============================================

@st.cache_resource
def load_model(model_path):
    """Load the trained model"""
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    try:
        model = UNetGenerator(in_channels=3, out_channels=3).to(device)
        model.eval()
        
        # Load weights
        state_dict = torch.load(model_path, map_location=device)
        
        # Handle different formats
        if isinstance(state_dict, dict) and 'generator_state_dict' in state_dict:
            model.load_state_dict(state_dict['generator_state_dict'])
        else:
            model.load_state_dict(state_dict)
        
        return model, device
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, None



# ============================================
# IMAGE PROCESSING
# ============================================

def preprocess_image(image):
    """Preprocess image for model input"""
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize([0.5]*3, [0.5]*3)
    ])
    
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image.astype(np.uint8))
    
    return transform(image).unsqueeze(0)

def denormalize(tensor):
    """Denormalize tensor to image"""
    return (tensor.permute(1, 2, 0).cpu().numpy() * 0.5 + 0.5).clip(0, 1)

def remove_clouds(model, image, device):
    """Remove clouds from image"""
    with torch.no_grad():
        x = preprocess_image(image).to(device)
        output = model(x)
        result = denormalize(output[0])
        result = (result * 255).astype(np.uint8)
    return result

# ============================================
# UI COMPONENTS
# ============================================

def sidebar():
    """Render sidebar with model selection"""
    with st.sidebar:
        # Header with gradient background
        st.markdown("""
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
            <h1 style='color: white; margin: 0; font-size: 2rem;'>🌤️ CLEAR</h1>
            <p style='color: white; margin: 5px 0 0 0; font-size: 0.9rem;'>
                Cloud-Less Earth Observation & Reconstruction
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Model selection
        st.markdown("### 🎯 Model Selection")
        
        # Check available models
        available_models = []
        model_dir = Path("models")
        
        if model_dir.exists():
            for model_path in model_dir.glob("*.pth"):
                available_models.append(model_path.name)
        
        if not available_models:
            st.warning("⚠️ No models found!")
            st.info("📁 Please place model files in 'models/' directory")
            st.info("📝 Supported formats: .pth files")
            return None
        
        selected_model = st.selectbox(
            "Select Model",
            available_models,
            help="Choose which trained model to use for inference",
            label_visibility="collapsed"
        )
        
        model_path = model_dir / selected_model
        
        # Model info with better styling
        st.markdown("---")
        st.markdown("### 📊 Model Information")
        
        if model_path.exists():
            size = model_path.stat().st_size / (1024 * 1024)
            st.markdown(f"""
            <div style='background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); 
                        padding: 15px; border-radius: 10px; border: 2px solid #667eea; margin: 10px 0;'>
                <div style='display: flex; align-items: center; margin-bottom: 8px;'>
                    <span style='font-size: 1.5rem; margin-right: 10px;'>📦</span>
                    <div>
                        <div style='font-size: 0.85rem; color: #666; font-weight: 600;'>MODEL SIZE</div>
                        <div style='font-size: 1.2rem; color: #667eea; font-weight: bold;'>{size:.1f} MB</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style='background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    padding: 15px; border-radius: 10px; border: 1px solid #dee2e6; margin: 10px 0;'>
            <div style='display: flex; align-items: center; margin-bottom: 12px;'>
                <span style='font-size: 1.3rem; margin-right: 10px;'>🏗️</span>
                <div>
                    <div style='font-size: 0.75rem; color: #666; font-weight: 600;'>ARCHITECTURE</div>
                    <div style='font-size: 1rem; color: #2c3e50; font-weight: 500;'>U-Net with Skip Connections</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style='background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    padding: 15px; border-radius: 10px; border: 1px solid #dee2e6; margin: 10px 0;'>
            <div style='display: flex; align-items: center; margin-bottom: 12px;'>
                <span style='font-size: 1.3rem; margin-right: 10px;'>📐</span>
                <div>
                    <div style='font-size: 0.75rem; color: #666; font-weight: 600;'>INPUT SIZE</div>
                    <div style='font-size: 1rem; color: #2c3e50; font-weight: 500;'>256×256 pixels</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style='background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    padding: 15px; border-radius: 10px; border: 1px solid #dee2e6; margin: 10px 0;'>
            <div style='display: flex; align-items: center; margin-bottom: 12px;'>
                <span style='font-size: 1.3rem; margin-right: 10px;'>⚙️</span>
                <div>
                    <div style='font-size: 0.75rem; color: #666; font-weight: 600;'>FRAMEWORK</div>
                    <div style='font-size: 1rem; color: #2c3e50; font-weight: 500;'>PyTorch</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style='background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    padding: 15px; border-radius: 10px; border: 1px solid #dee2e6; margin: 10px 0;'>
            <div style='display: flex; align-items: center;'>
                <span style='font-size: 1.3rem; margin-right: 10px;'>🧠</span>
                <div>
                    <div style='font-size: 0.75rem; color: #666; font-weight: 600;'>PARAMETERS</div>
                    <div style='font-size: 1rem; color: #2c3e50; font-weight: 500;'>41.8M (Generator)</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # System info
        st.markdown("---")
        st.markdown("### 💻 System Info")
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        if device.type == 'cuda':
            st.success(f"🚀 GPU Available: {torch.cuda.get_device_name(0)}")
        else:
            st.info("💻 Using CPU")
        
        st.markdown("---")
        st.markdown("""
        <div style='text-align: center; color: #666; font-size: 0.8rem;'>
            Built with ❤️ using PyTorch & Streamlit
        </div>
        """, unsafe_allow_html=True)
        
        return model_path

def main():
    """Main application"""
    
    # Hero section
    st.markdown("""
    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center;'>
        <h1 style='color: white; margin: 0; font-size: 2.5rem;'>🌤️ CLEAR</h1>
        <h2 style='color: white; margin: 10px 0 0 0; font-size: 1.2rem; font-weight: normal;'>
            Cloud-Less Earth Observation & Reconstruction
        </h2>
        <p style='color: rgba(255,255,255,0.9); margin: 15px 0 0 0;'>
            Transform cloudy satellite imagery into clear, actionable data using AI
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Features overview
    col_features = st.columns(3)
    with col_features[0]:
        st.markdown("""
        <div class='metric-card'>
            <h3 style='color: #667eea; margin: 0;'>🚀 Fast Processing</h3>
            <p style='color: #666; margin: 5px 0 0 0; font-size: 0.9rem;'>
                AI-powered cloud removal in seconds
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_features[1]:
        st.markdown("""
        <div class='metric-card'>
            <h3 style='color: #764ba2; margin: 0;'>🎯 High Quality</h3>
            <p style='color: #666; margin: 5px 0 0 0; font-size: 0.9rem;'>
                U-Net GAN for superior results
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col_features[2]:
        st.markdown("""
        <div class='metric-card'>
            <h3 style='color: #28a745; margin: 0;'>🌍 Real-world Ready</h3>
            <p style='color: #666; margin: 5px 0 0 0; font-size: 0.9rem;'>
                Trained on satellite datasets
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Sidebar
    sidebar_result = sidebar()
    if sidebar_result is None:
        st.stop()
    
    model_path = sidebar_result
    
    # Load model with better UI feedback
    with st.container():
        st.markdown("### 🔧 Loading Model")
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        with st.spinner("Initializing AI model..."):
            progress_bar.progress(30)
            status_text.text("Loading model architecture...")
            
            model, device = load_model(str(model_path))
            
            progress_bar.progress(70)
            status_text.text("Loading trained weights...")
            
            if model is None:
                st.error("❌ Failed to load model. Please check the model file.")
                st.stop()
            
            progress_bar.progress(100)
            status_text.text("Model ready!")
            time.sleep(0.5)
            
            progress_bar.empty()
            status_text.empty()
    
    st.markdown(f"""
    <div style='background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                padding: 20px; border-radius: 12px; border-left: 5px solid #28a745; 
                margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
        <div style='display: flex; align-items: center;'>
            <span style='font-size: 2rem; margin-right: 15px;'>✅</span>
            <div>
                <div style='font-size: 1.2rem; color: #155724; font-weight: bold; margin-bottom: 5px;'>
                    Model Loaded Successfully
                </div>
                <div style='font-size: 1.1rem; color: #155724; font-weight: 500;'>
                    {model_path.name}
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Main content with better layout
    col1, col2 = st.columns([1, 1], gap="large")
    
    with col1:
        st.markdown("### 📤 Upload Your Image")
        st.markdown("""
        <p style='color: #666; margin-bottom: 15px;'>
            Upload a cloudy satellite image to remove clouds using our AI model.
        </p>
        """, unsafe_allow_html=True)
        
        uploaded_file = st.file_uploader(
            "📁 Drop your image here or click to browse",
            type=['png', 'jpg', 'jpeg'],
            help="Supports PNG, JPG, JPEG formats (max 10MB)",
            label_visibility="visible"
        )
        
        # Empty state when no image is uploaded
        if uploaded_file is None:
            st.markdown("""
            <div style='text-align: center; padding: 40px; border: 2px dashed #dee2e6; 
                        border-radius: 10px; background-color: #f8f9fa;'>
                <div style='font-size: 3rem; margin-bottom: 10px;'>📷</div>
                <h4 style='color: #666; margin: 0;'>No image uploaded yet</h4>
                <p style='color: #999; margin: 5px 0 0 0; font-size: 0.9rem;'>
                    Upload a cloudy satellite image to get started
                </p>
            </div>
            """, unsafe_allow_html=True)
        
        if uploaded_file is not None:
            image = Image.open(uploaded_file).convert('RGB')
            
            # Image preview with container
            st.markdown("""
            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 10px; 
                        border: 1px solid #dee2e6; margin: 15px 0;'>
                <h4 style='margin: 0 0 10px 0; color: #1f77b4;'>📷 Original Image</h4>
            </div>
            """, unsafe_allow_html=True)
            
            st.image(image, caption=f"Uploaded Image ({image.size[0]}×{image.size[1]} pixels)", width='stretch')
            
            # Image details
            st.markdown(f"""
            <div class='info-box'>
                <strong>📐 Dimensions:</strong> {image.size[0]} × {image.size[1]} pixels<br>
                <strong>🎨 Format:</strong> {uploaded_file.name.split('.')[-1].upper()}<br>
                <strong>📊 Size:</strong> {uploaded_file.size / 1024:.1f} KB
            </div>
            """, unsafe_allow_html=True)
            
            # Process button with better styling
            st.markdown("<br>", unsafe_allow_html=True)
            if st.button("🌤️ Remove Clouds", type="primary", use_container_width=True):
                with col2:
                    st.markdown("### 🌤️ Cloud-Free Result")
                    
                    # Processing animation
                    with st.container():
                        progress_placeholder = st.empty()
                        for i in range(100):
                            progress_placeholder.progress(i + 1)
                            time.sleep(0.01)
                        progress_placeholder.empty()
                    
                    with st.spinner("🔄 Processing image with AI model..."):
                        start_time = time.time()
                        
                        # Process image
                        result = remove_clouds(model, image, device)
                        
                        end_time = time.time()
                        processing_time = end_time - start_time
                    
                    # Success message
                    st.markdown(f"""
                    <div class='success-box'>
                        ✅ <strong>Cloud removal completed!</strong> 
                        Processed in {processing_time:.2f} seconds
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Result display
                    st.markdown("""
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 10px; 
                                border: 1px solid #dee2e6; margin: 15px 0;'>
                        <h4 style='margin: 0 0 10px 0; color: #28a745;'>✨ Cloud-Removed Output</h4>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    st.image(result, caption="AI-generated cloud-free image (256×256)", width='stretch')
                    
                    # Metrics with better styling
                    st.markdown("### 📊 Processing Metrics")
                    col_metrics = st.columns(3)
                    
                    with col_metrics[0]:
                        st.markdown(f"""
                        <div class='metric-card'>
                            <h2 style='color: #667eea; margin: 0;'>⏱️</h2>
                            <h3 style='margin: 5px 0;'>{processing_time:.2f}s</h3>
                            <p style='color: #666; margin: 0; font-size: 0.8rem;'>Processing Time</p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with col_metrics[1]:
                        st.markdown(f"""
                        <div class='metric-card'>
                            <h2 style='color: #764ba2; margin: 0;'>📐</h2>
                            <h3 style='margin: 5px 0;'>256×256</h3>
                            <p style='color: #666; margin: 0; font-size: 0.8rem;'>Output Size</p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    with col_metrics[2]:
                        st.markdown(f"""
                        <div class='metric-card'>
                            <h2 style='color: #28a745; margin: 0;'>🧠</h2>
                            <h3 style='margin: 5px 0;'>U-Net</h3>
                            <p style='color: #666; margin: 0; font-size: 0.8rem;'>Model Type</p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    # Download button
                    st.markdown("<br>", unsafe_allow_html=True)
                    result_pil = Image.fromarray(result)
                    st.download_button(
                        label="📥 Download Cloud-Free Image",
                        data=result_pil.tobytes(),
                        file_name=f"clear_output_{int(time.time())}.png",
                        mime="image/png",
                        use_container_width=True
                    )
                    
                    # Comparison section
                    st.markdown("---")
                    with st.expander("👁️ Compare: Before & After", expanded=True):
                        st.markdown("""
                        <div style='text-align: center; margin-bottom: 15px;'>
                            <h4 style='color: #1f77b4;'>Side-by-Side Comparison</h4>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        col_compare1, col_compare2 = st.columns(2)
                        with col_compare1:
                            st.markdown("""
                            <div style='background-color: #ffeeee; padding: 10px; border-radius: 8px; 
                                        border-left: 4px solid #ff6b6b;'>
                                <h5 style='margin: 0; color: #c0392b;'>☁️ Cloudy (Original)</h5>
                            </div>
                            """, unsafe_allow_html=True)
                            st.image(image, width='stretch')
                        
                        with col_compare2:
                            st.markdown("""
                            <div style='background-color: #eeffee; padding: 10px; border-radius: 8px; 
                                        border-left: 4px solid #51cf66;'>
                                <h5 style='margin: 0; color: #27ae60;'>✨ Clear (Processed)</h5>
                            </div>
                            """, unsafe_allow_html=True)
                            st.image(result, width='stretch')

    # Tips and guidance section
    st.markdown("---")
    with st.expander("💡 Tips for Best Results"):
        st.markdown("""
        <div class='info-box'>
            <h4 style='margin: 0 0 10px 0; color: #667eea;'>🎯 Optimal Input Guidelines</h4>
            <ul style='color: #666; margin: 0; padding-left: 20px;'>
                <li><strong>Image Format:</strong> PNG, JPG, or JPEG</li>
                <li><strong>Recommended Size:</strong> 512×512 to 2048×2048 pixels</li>
                <li><strong>File Size:</strong> Under 10MB for best performance</li>
                <li><strong>Content:</strong> Images with visible cloud cover work best</li>
                <li><strong>Lighting:</strong> Consistent lighting conditions produce better results</li>
            </ul>
        </div>
        
        <div class='info-box'>
            <h4 style='margin: 0 0 10px 0; color: #764ba2;'>⚡ Performance Tips</h4>
            <ul style='color: #666; margin: 0; padding-left: 20px;'>
                <li><strong>GPU Acceleration:</strong> GPU processing is 10-50x faster than CPU</li>
                <li><strong>Batch Processing:</strong> Process multiple images sequentially</li>
                <li><strong>Model Selection:</strong> RICE2 model may handle diverse scenes better</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                border-radius: 10px; color: white;'>
        <h4 style='margin: 0;'>🌤️ CLEAR - Cloud-Less Earth Observation & Reconstruction</h4>
        <p style='margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;'>
            AI-Powered Satellite Image Enhancement
        </p>
        <p style='margin: 10px 0 0 0; font-size: 0.8rem; opacity: 0.7;'>
            Built with ❤️ using PyTorch & Streamlit | © 2026 CLEAR Project
        </p>
    </div>
    """, unsafe_allow_html=True)

def run():
    """Run the application"""
    
    # Check for models directory
    if not os.path.exists("models"):
        os.makedirs("models")
        st.info("📁 Created 'models' directory. Please place your model (.pth) files here.")
    
    main()

if __name__ == "__main__":
    run()