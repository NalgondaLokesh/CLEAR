"""
Model Loader for Cloud Removal Models
Handles loading and caching of U-Net models
"""

import torch
import os
from pathlib import Path
from typing import Dict, Optional
from .unet_generator import UNetGenerator


class ModelLoader:
    """Manages loading and caching of cloud removal models"""
    
    def __init__(self, model_path: str = "./models"):
        self.model_path = Path(model_path)
        self.models: Dict[str, torch.nn.Module] = {}
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
    def load_model(self, model_name: str, filename: str) -> Optional[torch.nn.Module]:
        """Load a specific model by name"""
        if model_name in self.models:
            return self.models[model_name]
        
        model_file = self.model_path / filename
        if not model_file.exists():
            raise FileNotFoundError(f"Model file not found: {model_file}")
        
        try:
            # Initialize model
            model = UNetGenerator(in_channels=3, out_channels=3).to(self.device)
            model.eval()
            
            # Load weights
            state_dict = torch.load(model_file, map_location=self.device)
            
            # Handle different checkpoint formats
            if isinstance(state_dict, dict) and 'generator_state_dict' in state_dict:
                model.load_state_dict(state_dict['generator_state_dict'])
            else:
                model.load_state_dict(state_dict)
            
            # Cache the model
            self.models[model_name] = model
            return model
            
        except Exception as e:
            raise RuntimeError(f"Error loading model {model_name}: {str(e)}")
    
    def get_available_models(self) -> list:
        """Get list of available model files"""
        if not self.model_path.exists():
            return []
        
        models = []
        for model_file in self.model_path.glob("*.pth"):
            models.append(model_file.name)
        return models
    
    def preload_models(self, model_config: Dict[str, str]) -> None:
        """Preload models based on configuration"""
        for model_name, filename in model_config.items():
            try:
                self.load_model(model_name, filename)
                print(f"Successfully loaded model: {model_name}")
            except Exception as e:
                print(f"Failed to load model {model_name}: {str(e)}")
    
    def get_model(self, model_name: str) -> Optional[torch.nn.Module]:
        """Get a loaded model by name"""
        return self.models.get(model_name)
    
    def get_device(self) -> torch.device:
        """Get the current device (CPU or CUDA)"""
        return self.device