import { createFileRoute } from '@tanstack/react-router'

import { TermsOfService } from 'components/staticPages'

function TermsOfServicePage() {
    return (
        <article className="prose prose-stone mx-auto w-full max-w-prose px-4 py-8 sm:px-6 lg:py-12">
            <TermsOfService />
        </article>
    )
}

export const Route = createFileRoute('/_public/terms-of-service')({
    component: TermsOfServicePage,
})
