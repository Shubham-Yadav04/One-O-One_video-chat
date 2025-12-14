import React from "react";

const RocketIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2.5L13.09 8.26L22 9L13.09 9.74L12 15.5L10.91 9.74L2 9L10.91 8.26L12 2.5Z"
      fill={fill}
    />
    <path
      d="M12 2L13.5 7.5L21 8L13.5 8.5L12 14L10.5 8.5L3 8L10.5 7.5L12 2Z"
      fill={fill}
    />
    <path d="M12 1L14 8L22 9L14 10L12 17L10 10L2 9L10 8L12 1Z" fill={fill} />
  </svg>
);

export default RocketIcon;
