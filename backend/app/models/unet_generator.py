"""
U-Net Generator Model for Cloud Removal
Based on the architecture used in the Streamlit application
"""

import torch
import torch.nn as nn


class ConvBlock(nn.Module):
    """Convolutional Block with optional normalization and dropout"""
    
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
    """U-Net Generator with skip connections for image-to-image translation"""
    
    def __init__(self, in_channels=3, out_channels=3, ngf=64):
        super().__init__()
        
        # Encoder
        self.down1 = ConvBlock(in_channels, ngf, down=True, use_norm=False)
        self.down2 = ConvBlock(ngf, ngf * 2, down=True)
        self.down3 = ConvBlock(ngf * 2, ngf * 4, down=True)
        self.down4 = ConvBlock(ngf * 4, ngf * 8, down=True)
        self.down5 = ConvBlock(ngf * 8, ngf * 8, down=True)
        self.down6 = ConvBlock(ngf * 8, ngf * 8, down=True)
        
        # Bottleneck
        self.bottleneck = nn.Sequential(
            nn.Conv2d(ngf * 8, ngf * 8, 4, 2, 1),
            nn.ReLU(True)
        )
        
        # Decoder
        self.up1 = ConvBlock(ngf * 8, ngf * 8, down=False, dropout=0.5)
        self.up2 = ConvBlock(ngf * 16, ngf * 8, down=False, dropout=0.5)
        self.up3 = ConvBlock(ngf * 16, ngf * 8, down=False, dropout=0.5)
        self.up4 = ConvBlock(ngf * 16, ngf * 4, down=False)
        self.up5 = ConvBlock(ngf * 8, ngf * 2, down=False)
        self.up6 = ConvBlock(ngf * 4, ngf, down=False)
        
        # Final layer
        self.final = nn.Sequential(
            nn.ConvTranspose2d(ngf * 2, out_channels, 4, 2, 1),
            nn.Tanh()
        )
    
    def forward(self, x):
        # Encoder path
        d1 = self.down1(x)
        d2 = self.down2(d1)
        d3 = self.down3(d2)
        d4 = self.down4(d3)
        d5 = self.down5(d4)
        d6 = self.down6(d5)
        
        # Bottleneck
        b = self.bottleneck(d6)
        
        # Decoder path with skip connections
        u1 = torch.cat([self.up1(b), d6], 1)
        u2 = torch.cat([self.up2(u1), d5], 1)
        u3 = torch.cat([self.up3(u2), d4], 1)
        u4 = torch.cat([self.up4(u3), d3], 1)
        u5 = torch.cat([self.up5(u4), d2], 1)
        u6 = torch.cat([self.up6(u5), d1], 1)
        
        return self.final(u6)