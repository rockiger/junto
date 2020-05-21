import React from 'react'

import { FulcrumFaq } from 'components/help/fulcrum-faq'

export function FAQ() {
    document.title = 'Fulcrum FAQ - Fulcrum.wiki'

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
