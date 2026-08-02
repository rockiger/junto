import { FulcrumFaq } from 'components/help/fulcrum-faq'

export function FAQ() {
    document.title = 'Fulcrum FAQ - Fulcrum.wiki'

    return (
        <>
            <FulcrumFaq />
            <style>{`
                body {
                    overflow-y: auto;
                    font-size: 1rem;
                }
            `}</style>
        </>
    )
}
