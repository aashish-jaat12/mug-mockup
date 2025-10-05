import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Image Placeholders ---
import LeftMugBase from '../../public/left.jpeg';
import RightMugBase from '../../public/right.jpeg'
import './Mugmod2.css'

const Mugmod2 = (props) => {
    const [designUrl, setDesignUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const leftMugRef = useRef(null);
    const rightMugRef = useRef(null);

    const handleDesignUpload = (event) => {
        const file = event?.target?.files[0] || props?.file;

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
        console.log( props.file , "ewfwfdfd");
        
    },[props.file])

    // Fixed download functionality
  const downloadMugImage = useCallback(async (mugRef, fileName) => {
    if (!mugRef.current || !designUrl) return;

    const mugContainer = mugRef.current;
    const baseImage = mugContainer.querySelector('.base-mug-img');
    const designImage = mugContainer.querySelector('.design-overlays, .design-overlays-right');

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

        // Draw design overlay with exact positioning from current CSS
        if (mugRef === leftMugRef) {
            // Left mug positioning - match current CSS
            const designWidth = 192 * (canvas.width / 300);
            const designHeight = 260 * (canvas.height / 300);
            const leftPosition = 95 * (canvas.width / 300);
            const topPosition = 22 * (canvas.height / 300);
            
            ctx.drawImage(
                designImg, 
                leftPosition, 
                topPosition, 
                designWidth, 
                designHeight
            );
        } else {
            // Right mug positioning - match current CSS
            const designWidth = 198 * (canvas.width / 300);
            const designHeight = 260 * (canvas.height / 300);
            const leftPosition = 25 * (canvas.width / 300);
            const topPosition = 16 * (canvas.height / 300);
            
            ctx.drawImage(
                designImg, 
                leftPosition, 
                topPosition, 
                designWidth, 
                designHeight
            );
        }

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
        downloadMugImage(leftMugRef, props?.file?.name );
        downloadMugImage(rightMugRef,  props?.file?.name);

    };

    // const downloadRightMug = () => {
    //     downloadMugImage(rightMugRef,  props?.file?.name);
    // };

    const isDesignLoaded = designUrl !== '';

    return (
            

            <div className="mug-previewss">
                
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
                            className={`design-overlays ${isDesignLoaded ? 'visible' : ''}`}
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
                            className={`design-overlays-right ${isDesignLoaded ? 'visible' : ''}`}
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
    );
};

export default Mugmod2;