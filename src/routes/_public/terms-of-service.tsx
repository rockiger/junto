import { createFileRoute } from '@tanstack/react-router'

import { TermsOfService } from 'components/staticPages'

export const Route = createFileRoute('/_public/terms-of-service')({
    component: TermsOfService,
})
