import React from "react";

const VideoOffIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 6.5L17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5Z"
      fill={fill}
    />
    <path
      d="M2.81 2.81L1.39 4.22L5 7.83V7C5 6.45 5.45 6 6 6H16C16.55 6 17 6.45 17 7V10.5L21 6.5V17.5L17 13.5V17C17 17.55 16.55 18 16 18H6C5.45 18 5 17.55 5 17V10.83L2.81 13.02L1.39 11.6L2.81 10.18L2.81 2.81Z"
      fill={fill}
    />
  </svg>
);

export default VideoOffIcon;
