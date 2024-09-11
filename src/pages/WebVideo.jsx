// src/components/WebcamVideo.js
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebVideo = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Start recording
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  // Handle the data when it's available
  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  // Stop recording and save the file
  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  // Download the video file
  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recorded-video.webm";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);  // Clean up
      setRecordedChunks([]);  // Reset the recorded chunks
    }
  }, [recordedChunks]);

  return (
    <div>
      <Webcam audio={true} ref={webcamRef} width={350} />
      <div>
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Recording</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Recording</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download Video</button>
        )}
      </div>
    </div>
  );
};

export default WebVideo;
