import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicy } from 'components/staticPages'

export const Route = createFileRoute('/_public/privacy-policy')({
    component: PrivacyPolicy,
})
