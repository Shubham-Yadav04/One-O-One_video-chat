import React from "react";

const MicrophoneOffIcon = ({
  className = "w-6 h-6",
  fill = "currentColor",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 11H17.3C17.3 11.74 17.18 12.45 16.96 13.12L18.35 14.51C18.88 13.45 19.2 12.25 19.2 11H19Z"
      fill={fill}
    />
    <path
      d="M14.98 11.17C14.98 11.11 15 11.06 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V5.18L14.98 11.17Z"
      fill={fill}
    />
    <path
      d="M4.27 3L3 4.27L9.01 10.28V11C9.01 12.66 10.34 14 12 14C12.22 14 12.44 13.97 12.65 13.92L14.73 16C13.91 16.36 13.01 16.58 12.05 16.58C7.63 16.58 4.05 13 4.05 8.5H2.05C2.05 13.92 6.13 18.5 12 18.5C13.37 18.5 14.64 18.2 15.77 17.68L19.73 21.64L21 20.37L4.27 3Z"
      fill={fill}
    />
  </svg>
);

export default MicrophoneOffIcon;
