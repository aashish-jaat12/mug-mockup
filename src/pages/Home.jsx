import React, { useState, useRef } from "react";
import MugMockupUploader from "../components/MugMockupUploader";
import Mugmod2 from "../components/Mugmod2";
import Mugmod3 from "../components/Mugmod3";
import Mugmod4 from "../components/MugDom4";

function Home() {
  const [file, setFile] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile("");
  };

  return (
    <div className="upload-section">
      <div className="header-content">
        <h1 className="main-title">Design Your Perfect Mug</h1>
        <p className="subtitle">
          Upload your design and see it come to life on our premium mugs
        </p>
      </div>

      <div
        className={`upload-container ${isDragOver ? "drag-over" : ""} ${
          file ? "has-file" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadAreaClick}
      >
        <div className="upload-content">
          {file ? (
            <div className="file-preview-section">
              <div className="preview-wrapper">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Design preview"
                  className="preview-image"
                />
                <button
                  className="remove-file-btn"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  ×
                </button>
              </div>
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                className="change-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose Different Image
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="10,9 9,9 8,9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="upload-text-content">
                <h3 className="upload-title">Upload Your Design</h3>
                <p className="upload-description">
                  Drag & drop your image here or click to browse
                </p>
                <p className="upload-requirements">
                  Supports: PNG, JPG, JPEG, GIF • Max: 10MB
                </p>
              </div>
              <button className="browse-files-btn">Browse Files</button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          id="design-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden-file-input"
        />
      </div>

      {file && (
        <div className="upload-success">
          <div className="success-message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Design uploaded successfully! Your image is ready for mug preview.
          </div>
        </div>
      )}

      {file && (
        <>
          <div className="mug-previews-row">
            <MugMockupUploader file={file} />
            <Mugmod2 file={file} />
          </div>
          <div className="mug-previews-row">
            <Mugmod3 file={file} />
            <Mugmod4 file={file} />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;