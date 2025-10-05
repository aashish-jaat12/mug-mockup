import React, { useState, useRef } from 'react';
import './Fullimg.css';

function FullimgApp() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setHasImage(true);
      
      // Auto-adjust image to fit mug surface
      const img = new Image();
      img.onload = function() {
        // Calculate scale to fit the mug surface
        const mugSurfaceWidth = 115;
        const mugSurfaceHeight = 143;
        const scale = Math.min(
          mugSurfaceWidth / img.width,
          mugSurfaceHeight / img.height
        ) * 0.9;
        setImageScale(scale);
        setImagePosition({ x: 0, y: 0 });
      };
      img.src = imageUrl;
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setHasImage(false);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    alert('Mug preview download functionality would be implemented here!');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image adjustments
  const adjustImage = (type) => {
    switch(type) {
      case 'zoom-in':
        setImageScale(prev => prev * 1.1);
        break;
      case 'zoom-out':
        setImageScale(prev => Math.max(0.5, prev * 0.9));
        break;
      case 'move-up':
        setImagePosition(prev => ({ ...prev, y: prev.y - 10 }));
        break;
      case 'move-down':
        setImagePosition(prev => ({ ...prev, y: prev.y + 10 }));
        break;
      case 'move-left':
        setImagePosition(prev => ({ ...prev, x: prev.x - 10 }));
        break;
      case 'move-right':
        setImagePosition(prev => ({ ...prev, x: prev.x + 10 }));
        break;
      case 'center':
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="apps-container">
      <div className="main-content">
        <div className="preview-section">
          <div className="mug-container">
            <div className="mug-preview">
              <div className="mug-base">
                <img 
                  src="mug1.jpg" 
                  alt="Mug" 
                  className="mug-image" 
                />
                <div className="mug-surface">
                  {hasImage ? (
                    <div 
                      className="image-container"
                      style={{
                        transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                      }}
                    >
                      <img 
                        src={uploadedImage} 
                        alt="User Upload" 
                        className="overlay-image"
                      />
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="upload-icon">📷</div>
                      <span>Upload Your Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {hasImage && (
              <div className="adjustment-controls">
                <h4>Adjust Your Image</h4>
                <div className="control-group">
                  <div className="control-row">
                    <button onClick={() => adjustImage('zoom-in')} className="control-btn">
                      <span>+</span>
                      Zoom In
                    </button>
                    <button onClick={() => adjustImage('zoom-out')} className="control-btn">
                      <span>-</span>
                      Zoom Out
                    </button>
                  </div>
                  <div className="control-row">
                    <button onClick={() => adjustImage('move-up')} className="control-btn">
                      <span>↑</span>
                      Move Up
                    </button>
                    <button onClick={() => adjustImage('move-down')} className="control-btn">
                      <span>↓</span>
                      Move Down
                    </button>
                  </div>
                  <div className="control-row">
                    <button onClick={() => adjustImage('move-left')} className="control-btn">
                      <span>←</span>
                      Move Left
                    </button>
                    <button onClick={() => adjustImage('move-right')} className="control-btn">
                      <span>→</span>
                      Move Right
                    </button>
                  </div>
                  <button onClick={() => adjustImage('center')} className="control-btn reset">
                    <span>⟲</span>
                    Reset Position
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="control-section">
          <div className="header-content">
            <h1>Custom Mug Designer</h1>
            <p className="subtitle">Create your personalized mug in seconds</p>
          </div>
          
          <div className="upload-area" onClick={handleUploadClick}>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="file-input"
            />
            <div className="upload-content">
              <div className="upload-icon-large">📷</div>
              <h3>Click to Upload Your Photo</h3>
              <p>JPG, PNG, or WebP • Max 10MB</p>
            </div>
          </div>

          <div className="instructions">
            <h3>How to Use:</h3>
            <ul>
              <li>Click the upload area to select your image</li>
              <li>Your image will automatically be positioned on the mug</li>
              <li>The image is constrained to the printable area</li>
              <li>For best results, use square or portrait-oriented images</li>
              <li>Reset to try a different image</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              className="reset-button" 
              onClick={handleReset}
              disabled={!hasImage}
            >
              Reset Mug
            </button>
            <button 
              className="download-button" 
              onClick={handleDownload}
              disabled={!hasImage}
            >
              Download Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullimgApp;