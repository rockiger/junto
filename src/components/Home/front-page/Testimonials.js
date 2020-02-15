import React from 'react'

import henryLevins from 'static/img/Henry_Levins.jpg'

import './testimonials.scss'

export const Testimonials = () => {
    return (
        <div className="testimonials-wrapper">
            <div align="center">
                <div className="testimonials__large-img">
                    <img alt="Henry Levins" src={henryLevins} />
                </div>
                <blockquote
                    style={{
                        borderLeft: 'none',
                        color: 'inherit',
                        fontWeight: 500,
                    }}
                >
                    Finally, a way to make sense of all the content in my Google
                    Drive.
                </blockquote>
                <cite>
                    Henry Levens
                    <br />
                    CEO, Acuserv
                </cite>
            </div>
        </div>
    )
}
