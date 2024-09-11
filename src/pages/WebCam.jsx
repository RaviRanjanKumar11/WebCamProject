import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebCam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Capture the image when the webcam is ready
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  // Automatically download the captured image
  const downloadImage = useCallback((imageSrc) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'captured-image.jpg';  // Specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  // Clean up the link after download
  }, []);

  // Use effect to capture the image after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (webcamRef.current) {
        captureImage();
      }
    }, 2000);  // Give the webcam time to initialize (2 seconds)

    return () => clearTimeout(timer);  // Clean up the timer on unmount
  }, [captureImage]);

  // Download the image once it is captured
  useEffect(() => {
    if (imgSrc) {
      downloadImage(imgSrc);
    }
  }, [imgSrc, downloadImage]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />
    </div>
  );
};

export default WebCam;
