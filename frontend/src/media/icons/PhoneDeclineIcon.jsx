import React from "react";

const PhoneDeclineIcon = ({ className = "w-6 h-6", fill = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9ZM20 4H16.83L15 2H9L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H6.83L8.05 4.8H15.95L17.17 6H20V18Z"
      fill={fill}
    />
    <path
      d="M12 7C8.69 7 6 9.69 6 13S8.69 19 12 19 18 16.31 18 13 15.31 7 12 7ZM12 17C9.79 17 8 15.21 8 13S9.79 9 12 9 16 10.79 16 13 14.21 17 12 17Z"
      fill={fill}
    />
  </svg>
);

export default PhoneDeclineIcon;
