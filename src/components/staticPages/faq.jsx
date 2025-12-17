import React, { useEffect } from 'react'

import { FulcrumFaq } from 'components/help/fulcrum-faq'
import { PageView } from 'components/Tracking'

export function FAQ() {
    document.title = 'Fulcrum FAQ - Fulcrum.wiki'
    useEffect(() => PageView(), [])

    return (
        <>
            <div className="container container__max640">
                <FulcrumFaq />
            </div>
            <style>{`
                body {
                    overflow-y: auto;
                    font-size: 1rem;
                }
            `}</style>
        </>
    )
}
