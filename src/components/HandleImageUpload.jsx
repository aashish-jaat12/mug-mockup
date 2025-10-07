import React, { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import "./Fullimg.css";

function FullimgApp() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);
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
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setHasImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ Download Mug Image using html2canvas
 const downloadMugImage = async (mugRef, fileName) => {
  if (!mugRef.current) return;

  setIsDownloading(true);

  try {
    const canvas = await html2canvas(mugRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2, // for higher quality
    });

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
    }, 'image/png');
  } catch (error) {
    console.error('Download failed:', error);
    setIsDownloading(false);
  }
};

  const downloadLeftImage = () => {
    downloadMugImage(leftMugRef, "left-side-mug");
  };

  const downloadRightImage = () => {
    downloadMugImage(rightMugRef, "right-side-mug");
  };

  const handleDownload = async () => {
    if (!hasImage) return;

    setIsDownloading(true);

    try {
      await downloadMugImage(leftMugRef, "left-side-mug");
      setTimeout(() => {
        downloadMugImage(rightMugRef, "right-side-mug");
      }, 1000);
    } catch (err) {
      console.error("Error downloading both sides:", err);
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
                  <img src="mug.jpeg" alt="Mug" className="mug-image" crossOrigin="anonymous" />
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
                  {isDownloading ? "Downloading..." : "Download Left"}
                </button>
              </div>

              {/* Right Mug */}
              <div className="mug-wrapper">
                <div className="mug-base" ref={rightMugRef}>
                  <img src="right.jpeg" alt="Mug" className="mug-image" crossOrigin="anonymous" />
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
                  {isDownloading ? "Downloading..." : "Download Right"}
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
              {isDownloading ? "Downloading..." : "Download Both Sides"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullimgApp;
