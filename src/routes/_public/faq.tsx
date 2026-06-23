import { createFileRoute } from '@tanstack/react-router'

import { FAQ } from 'components/staticPages'

function FaqPage() {
    return (
        <article className="prose prose-stone mx-auto w-full max-w-prose px-4 py-8 sm:px-6 lg:py-12">
            <FAQ />
        </article>
    )
}

export const Route = createFileRoute('/_public/faq')({
    component: FaqPage,
})
