import React from "react";

const SmartAudioIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
      fill={fill}
    />
    <path
      d="M19 11C19 15.42 15.42 19 11 19H13C17.42 19 21 15.42 21 11H19Z"
      fill={fill}
    />
    <path d="M11 19V22H13V19H11Z" fill={fill} />
    <path
      d="M5 11C5 15.42 8.58 19 13 19V17C9.69 17 7 14.31 7 11H5Z"
      fill={fill}
    />
    <path d="M16 8L18 6L20 8L18 10L16 8Z" fill="white" />
  </svg>
);

export default SmartAudioIcon;
