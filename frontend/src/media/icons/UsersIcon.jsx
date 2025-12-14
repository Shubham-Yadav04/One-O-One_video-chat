import React from "react";

const UsersIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4C18.21 4 20 5.79 20 8C20 10.21 18.21 12 16 12C15.74 12 15.5 11.96 15.26 11.9C15.1 12.55 14.66 13.1 14.06 13.4C14.7 13.78 15.26 14.26 15.72 14.82C16.21 15.42 16.5 16.16 16.5 17V18H20V17C20 15.74 19.5 14.6 18.74 13.8C19.42 12.86 20 11.7 20 10.5C20 8.01 18.34 5.9 16 5.2V4Z"
      fill={fill}
    />
    <path
      d="M8 4C10.21 4 12 5.79 12 8C12 10.21 10.21 12 8 12C5.79 12 4 10.21 4 8C4 5.79 5.79 4 8 4ZM8 14C10.67 14 16 15.34 16 18V20H0V18C0 15.34 5.33 14 8 14Z"
      fill={fill}
    />
  </svg>
);

export default UsersIcon;
