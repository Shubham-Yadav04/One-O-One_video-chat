import React from "react";

const HDVideoIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
      fill={fill}
    />
    <path
      d="M8 9H10V11H8V9ZM8 12H10V14H8V12ZM12 9H14V11H12V9ZM12 12H14V14H12V12Z"
      fill="white"
    />
  </svg>
);

export default HDVideoIcon;
