import { createFileRoute } from '@tanstack/react-router'
import { Drive } from 'components/Drive/index'

export const Route = createFileRoute('/drive')({
    component: Drive,
})
