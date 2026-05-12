"""
DeepFake Detection Model Architecture
Exactly matches the Colab training architecture
"""
import torch
import torch.nn as nn
import torchvision.models as models


class DeepFakeDetector(nn.Module):
    """
    DeepFake Detection Model using ResNext50 + LSTM
    Architecture matches the original model exactly
    """
    def __init__(self, num_classes=2, latent_dim=2048, lstm_layers=1,
                 hidden_dim=2048, bidirectional=False):
        super(DeepFakeDetector, self).__init__()

        # ResNext50 backbone (remove last 2 layers: avgpool and fc)
        # CRITICAL: Use pretrained=True to match Colab training
        model = models.resnext50_32x4d(pretrained=True)
        self.model = nn.Sequential(*list(model.children())[:-2])

        # LSTM for temporal modeling
        self.lstm = nn.LSTM(latent_dim, hidden_dim, lstm_layers, bidirectional)

        # Additional layers
        self.relu = nn.LeakyReLU()
        self.dp = nn.Dropout(0.4)
        self.linear1 = nn.Linear(2048, num_classes)
        self.avgpool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        """
        Forward pass
        Input: (batch_size, seq_length, channels, height, width)
        Output: feature_map, classification_logits
        """
        batch_size, seq_length, c, h, w = x.shape

        # Process all frames through ResNext
        x = x.view(batch_size * seq_length, c, h, w)
        fmap = self.model(x)

        # Global average pooling
        x = self.avgpool(fmap)
        x = x.view(batch_size, seq_length, 2048)

        # LSTM processing
        x_lstm, _ = self.lstm(x, None)

        # Classification on last timestep
        output = self.dp(self.linear1(x_lstm[:, -1, :]))

        return fmap, output