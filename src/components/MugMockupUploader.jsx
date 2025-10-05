import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Image Placeholders ---
import LeftMugBase from '../../public/left.jpeg';
import RightMugBase from '../../public/right.jpeg'
import './MugMockupUploader.css'

const MugMockupUploader = (props) => {
    const [designUrl, setDesignUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const leftMugRef = useRef(null);
    const rightMugRef = useRef(null);

    const handleDesignUpload =(event) => {
        const file = event?.target?.files[0] ||  props?.file

        if (file) {
            setIsLoading(true);
            const reader = new FileReader();

            reader.onload = (e) => {
                setDesignUrl(e.target.result);
                setIsLoading(false);
            };

            reader.onerror = () => {
                setIsLoading(false);
            };

            reader.readAsDataURL(file);
        }
    }


       useEffect(()=>{
            handleDesignUpload( props.file)
            
        },[props.file])

    // Fixed download functionality
    const downloadMugImage = useCallback(async (mugRef, fileName) => {
    if (!mugRef.current || !designUrl) return;

    const mugContainer = mugRef.current;
    const baseImage = mugContainer.querySelector('.base-mug-img');
    const designImage = mugContainer.querySelector('.design-overlay, .design-overlay-right');

    if (!baseImage || !designImage) return;

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

        // Get computed styles from CSS
        const computedStyle = window.getComputedStyle(designImage);
        const designWidth = parseFloat(computedStyle.width);
        const designHeight = parseFloat(computedStyle.height);
        const leftPosition = parseFloat(computedStyle.left);
        const topPosition = parseFloat(computedStyle.top);

        // Scale values according to base image size
        const scaledWidth = designWidth * (canvas.width / 300);
        const scaledHeight = designHeight * (canvas.height / 300);
        const scaledLeft = leftPosition * (canvas.width / 300);
        const scaledTop = topPosition * (canvas.height / 300);
        
        // Draw design overlay with exact positioning from CSS
        ctx.drawImage(
            designImg, 
            scaledLeft, 
            scaledTop, 
            scaledWidth, 
            scaledHeight
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
        }, 'image/png');

    } catch (error) {
        console.error('Error downloading image:', error);
    }
}, [designUrl]);

    const downloadLeftMug = () => {
        downloadMugImage(leftMugRef, props?.file?.name);
        downloadMugImage(rightMugRef,  props?.file?.name);

    };

    // const downloadRightMug = () => {
    //     downloadMugImage(rightMugRef,  props?.file?.name);
    // };

    const isDesignLoaded = designUrl !== '';

    return (
        <div >
            

            {isLoading && (
                <div className="loading">Loading your design...</div>
            )}

            <div className="mug-previews">
                
                {/* Left Mug */}
                <div className="mug-wrapper">
                    <div className="mug left" ref={leftMugRef}>
                        <img 
                            src={LeftMugBase} 
                            alt="Left Handed Mug Base" 
                            className="base-mug-img" 
                        />
                        <img 
                            src={designUrl || '#'} 
                            alt="Design on Left Mug" 
                            className={`design-overlay ${isDesignLoaded ? 'visible' : ''}`}
                            id="design-on-left"
                        />
                    </div>
                    <button 
                        onClick={downloadLeftMug} 
                        disabled={!isDesignLoaded || isLoading}
                        className="download-btn"
                    >
                        Download  Mug
                    </button>
                </div>

                {/* Right Mug */}
                <div className="mug-wrapper">
                    <div className="mug right" ref={rightMugRef}>
                        <img 
                            src={RightMugBase} 
                            alt="Right Handed Mug Base" 
                            className="base-mug-img" 
                        />
                        <img 
                            src={designUrl || '#'} 
                            alt="Design on Right Mug" 
                            className={`design-overlay-right ${isDesignLoaded ? 'visible' : ''}`}
                            id="design-on-right"
                        />
                    </div>
                    {/* <button 
                        onClick={downloadRightMug} 
                        disabled={!isDesignLoaded || isLoading}
                        className="download-btn"
                    >
                        Download Right Mug
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default MugMockupUploader;