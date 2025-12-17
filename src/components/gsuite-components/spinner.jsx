import React from 'react'

export { Spinner }
export default function Spinner({ children = null, style = {} }) {
    return (
        <div className="Spinner" style={style}>
            {children}
            <Svg />
            <style>{`
            .Spinner {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-top: 2rem;
            }
            .Spinner-spinner {
            animation: rotator 1.4s linear infinite;
            margin: 0 auto;
            }
            @keyframes rotator {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(270deg);
            }
            }
            .Spinner-path {
            stroke-dasharray: 187;
            stroke-dashoffset: 0;
            transform-origin: center;
            animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
            }
            @keyframes colors {
            0% {
                stroke: #4285f4;
            }
            25% {
                stroke: #de3e35;
            }
            50% {
                stroke: #f7c223;
            }
            75% {
                stroke: #1b9a59;
            }
            100% {
                stroke: #4285f4;
            }
            }
            @keyframes dash {
            0% {
                stroke-dashoffset: 187;
            }
            50% {
                stroke-dashoffset: 46.75;
                transform: rotate(135deg);
            }
            100% {
                stroke-dashoffset: 187;
                transform: rotate(450deg);
            }
            }                
        `}</style>
        </div>
    )
}

function Svg() {
    return (
        <svg
            className="Spinner-spinner"
            width="32px"
            height="32px"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                className="Spinner-path"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                cx="33"
                cy="33"
                r="30"
            ></circle>
        </svg>
    )
}
