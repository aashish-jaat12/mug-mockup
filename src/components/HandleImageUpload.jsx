import React, { useState, useRef, useCallback } from "react";
import "./Fullimg.css";

function FullimgApp() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);
  const leftMugRef = useRef(null);
  const rightMugRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setHasImage(true);

      const img = new Image();
      img.onload = function () {
        const mugSurfaceWidth = 115;
        const mugSurfaceHeight = 143;
        const scale =
          Math.min(mugSurfaceWidth / img.width, mugSurfaceHeight / img.height) *
          0.9;
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
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Download function with exact positioning
  const downloadMugImage = useCallback(async (mugRef, fileName) => {
    if (!mugRef.current || !uploadedImage) return;

    const mugContainer = mugRef.current;
    const baseImage = mugContainer.querySelector('.mug-image');
    const designImage = mugContainer.querySelector('.overlay-image, .overlay-image-right');

    if (!baseImage || !designImage) return;

    setIsDownloading(true);
    
    try {
        // Load both images
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const [baseImg, designImg] = await Promise.all([
            loadImage(baseImage.src),
            loadImage(designImage.src)
        ]);

        // Create canvas with exact dimensions
        const canvas = document.createElement('canvas');
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        const ctx = canvas.getContext('2d');

        // Draw base image
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

        // Get the actual displayed position and dimensions from CSS
        const mugRect = mugContainer.getBoundingClientRect();
        const designRect = designImage.getBoundingClientRect();
        
        // Calculate relative position within the mug
        const relativeLeft = (designRect.left - mugRect.left) / mugRect.width;
        const relativeTop = (designRect.top - mugRect.top) / mugRect.height;
        const relativeWidth = designRect.width / mugRect.width;
        const relativeHeight = designRect.height / mugRect.height;

        // Apply to canvas coordinates
        const designX = relativeLeft * canvas.width;
        const designY = relativeTop * canvas.height;
        const designWidth = relativeWidth * canvas.width;
        const designHeight = relativeHeight * canvas.height;

        // Draw design overlay with exact positioning
        ctx.drawImage(
            designImg, 
            designX, 
            designY, 
            designWidth, 
            designHeight
        );

        // Download the image
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsDownloading(false);
        }, 'image/png', 1.0);

    } catch (error) {
        console.error('Error downloading image:', error);
        setIsDownloading(false);
    }
  }, [uploadedImage]);

  // Individual download functions
  const downloadLeftImage = () => {
    downloadMugImage(leftMugRef, 'left-side-mug');
  };

  const downloadRightImage = () => {
    downloadMugImage(rightMugRef, 'right-side-mug');
  };

  // Download both sides
  const handleDownload = async () => {
    if (!hasImage) return;
    
    setIsDownloading(true);
    try {
      // Download left side first
      await new Promise((resolve) => {
        downloadMugImage(leftMugRef, 'left-side-mug');
        setTimeout(resolve, 1000);
      });
      
      // Download right side after a delay
      setTimeout(() => {
        downloadMugImage(rightMugRef, 'right-side-mug');
      }, 1500);
    } catch (error) {
      console.error('Error downloading images:', error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="apps-container">
      <div className="main-content">
        <div className="preview-section">
          <div className="mug-container">
            <div className="mug-preview">
              {/* Left Mug */}
              <div className="mug-wrapper">
                <div className="mug-base" ref={leftMugRef}>
                  <img 
                    src="mug.jpeg" 
                    alt="Mug" 
                    className="mug-image"
                    crossOrigin="anonymous"
                  />
                  <div className="mug-surface">
                    {hasImage ? (
                      <div className="image-container">
                        <img
                          src={uploadedImage}
                          alt="User Upload"
                          className="overlay-image"
                          crossOrigin="anonymous"
                          
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
                <button 
                  className="download-side-btn left-download"
                  onClick={downloadLeftImage}
                  disabled={!hasImage || isDownloading}
                >
                  {isDownloading ? 'Downloading...' : 'Download Left'}
                </button>
              </div>
              
              {/* Right Mug */}
              <div className="mug-wrapper">
                <div className="mug-base" ref={rightMugRef}>
                  <img 
                    src="right.jpeg" 
                    alt="Mug" 
                    className="mug-image"
                    crossOrigin="anonymous"
                  />
                  <div className="mug-surface-right">
                    {hasImage ? (
                      <div className="image-container-right">
                        <img
                          src={uploadedImage}
                          alt="User Upload"
                          className="overlay-image-right"
                          crossOrigin="anonymous"
                         
                        />
                      </div>
                    ) : (
                      <div className="empty-state-right">
                        <div className="upload-icon">📷</div>
                        <span>Upload Your Photo</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  className="download-side-btn right-download"
                  onClick={downloadRightImage}
                  disabled={!hasImage || isDownloading}
                >
                  {isDownloading ? 'Downloading...' : 'Download Right'}
                </button>
              </div>
            </div>
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

         

          <div className="action-buttons">
            <button
              className="reset-button"
              onClick={handleReset}
              disabled={!hasImage || isDownloading}
            >
              Reset Mug
            </button>
            <button
              className="download-button"
              onClick={handleDownload}
              disabled={!hasImage || isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download Both Sides'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullimgApp;