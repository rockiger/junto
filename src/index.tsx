import { createRoot, hydrateRoot } from 'react-dom/client'
import './lib/helper/globals'
import './store/app-store'
import './tailwind.css'
import App from './components/app'
import { initGA, setGA } from './components/Tracking'
import * as serviceWorker from './serviceWorker'

initGA('UA-151325933-1')
setGA({ anonymizeIp: true })

// Remove console from production builds (import.meta.env.DEV is reliable under Vite)
if (!import.meta.env.DEV) {
    function noop() { }
    console.log = noop
    console.warn = noop
    console.error = noop
}

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element "#root" not found')
}
if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App />)
} else {
    createRoot(rootElement).render(<App />)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
