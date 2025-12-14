import React from 'react'

function Profile() {
return (
    <svg
        className='w-full h-full'
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Profile"
    >
        <circle cx="16" cy="16" r="16" fill="#E5E7EB" />
        <circle cx="16" cy="13" r="5" fill="#9CA3AF" />
        <path
            d="M8 25c0-3.866 3.582-7 8-7s8 3.134 8 7"
            fill="#9CA3AF"
        />
    </svg>
)
}

export default Profile
