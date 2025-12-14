import React from "react";

const MultiDeviceIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z"
      fill={fill}
    />
    <path d="M6 8H18V14H6V8Z" fill="white" />
    <path
      d="M8 2H16C17.1 2 18 2.9 18 4V6H16V4H8V6H6V4C6 2.9 6.9 2 8 2Z"
      fill={fill}
    />
    <path
      d="M20 20H4C2.9 20 2 19.1 2 18V20H22V18C22 19.1 21.1 20 20 20Z"
      fill={fill}
    />
  </svg>
);

export default MultiDeviceIcon;
