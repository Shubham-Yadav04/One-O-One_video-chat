import React from "react";

const HomeIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={fill} />
  </svg>
);

export default HomeIcon;
