import React from 'react';

export default function Sidebar() {
    return (
        <div className="Sidebar">
            <div
                className="Sidebar-newButton"
                onClick={() => console.log('onClickNewPage:')}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                </svg>
                <span>New Page</span>
            </div>
            <style jsx>{`
                .Sidebar-newButton {
                    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
                        0 1px 3px 1px rgba(60, 64, 67, 0.149);
                    align-items: center;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid transparent;
                    border-radius: 24px;
                    color: #3c4043;
                    display: inline-flex;
                    font-size: 14px;
                    font-weight: 600;
                    height: 48px;
                    letter-spacing: 0.15px;
                    line-height: 22px;
                    margin: 0 0 0 -5px;
                    min-width: 120px;
                    padding: 0 10px 0 15px;
                    text-transform: none;
                    width: inherit;
                    cursor: pointer;
                }
                .Sidebar-newButton:hover {
                    box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.302),
                        0 4px 8px 3px rgba(60, 64, 67, 0.149);
                    background-color: #f8f9fa;
                    outline: none;
                }
                .Sidebar svg {
                    fill: #3d5afe;
                }
                .Sidebar span {
                    margin-left: 15px;
                }
            `}</style>
        </div>
    );
}
