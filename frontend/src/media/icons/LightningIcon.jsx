import React from "react";

const LightningIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 2V13H10V22L17 10H13L17 2H7Z" fill={fill} />
  </svg>
);

export default LightningIcon;
