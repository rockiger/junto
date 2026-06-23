import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicy } from 'components/staticPages'

function PrivacyPolicyPage() {
    return (
        <article className="prose prose-stone mx-auto w-full max-w-prose px-4 py-8 sm:px-6 lg:py-12">
            <PrivacyPolicy />
        </article>
    )
}

export const Route = createFileRoute('/_public/privacy-policy')({
    component: PrivacyPolicyPage,
})
