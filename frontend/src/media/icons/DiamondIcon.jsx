import React from "react";

const DiamondIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 2L2 7L12 22L22 7L18 2H6Z" fill={fill} />
    <path d="M12 2L8 7L12 12L16 7L12 2Z" fill="white" opacity="0.3" />
  </svg>
);

export default DiamondIcon;
