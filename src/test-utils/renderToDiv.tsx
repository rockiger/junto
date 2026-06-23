import type { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

export function renderToDiv(element: ReactElement): {
	container: HTMLDivElement
	unmount: () => void
} {
	const container = document.createElement('div')
	document.body.appendChild(container)
	const root = createRoot(container)
	root.render(element)
	return {
		container,
		unmount: () => {
			root.unmount()
			container.remove()
		},
	}
}
