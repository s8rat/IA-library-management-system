
import { useState } from 'react';
import { FALLBACK_VIDEOS } from '../utils/constants';


const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    console.error("Error loading the uploaded video. Using fallback video instead.");
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full object-cover"
        onError={handleVideoError}
      >
        {!videoError ? (
          <source src="https://res.cloudinary.com/drvgczmup/video/upload/v1746488034/z7phwzqocypuzmlvw3pz.mp4" type="video/mp4" />
        ) : (
          <source src={FALLBACK_VIDEOS.LIBRARY} type="video/mp4" />
        )}
        Your browser does not support the video tag.
      </video>
      {/* Overlay to darken the video slightly */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default VideoBackground;