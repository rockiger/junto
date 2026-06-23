import React from 'react'

const SvgComponent = props => (
    <svg width={24} height={24} {...props}>
        <g fillRule="evenodd">
            <path d="M3 11.369l17.628-8.336-5.442 8.668z" fill="#ea4335" />
            <path d="M12.19 16.35L21 21l-.372-18z" fill="#4285f4" />
            <path d="M21 21l-10.862-5.726L9.326 21z" fill="#34a853" />
            <path d="M3 11.369l7.874.209L9.326 21z" fill="#fbbc05" />
        </g>
    </svg>
)

export default SvgComponent
