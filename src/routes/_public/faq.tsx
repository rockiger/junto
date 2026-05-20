import { createFileRoute } from '@tanstack/react-router'

import { FAQ } from 'components/staticPages'

export const Route = createFileRoute('/_public/faq')({
    component: FAQ,
})
