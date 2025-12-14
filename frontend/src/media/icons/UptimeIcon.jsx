import React from "react";

const UptimeIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
      fill={fill}
    />
    <path
      d="M12 4C16.41 4 20 7.59 20 12S16.41 20 12 20 4 16.41 4 12 7.59 4 12 4ZM12 18C15.31 18 18 15.31 18 12S15.31 6 12 6 6 8.69 6 12 8.69 18 12 18Z"
      fill={fill}
    />
  </svg>
);

export default UptimeIcon;
