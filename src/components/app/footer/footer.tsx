import { Footer as FooterMenu } from 'components/staticPages'
import type { ReactElement } from 'react'


export default function Footer(): ReactElement {
    return (
        <footer className="bg-pub-surface" style={{ gridArea: 'footer' }}>
            <FooterMenu />
        </footer>
    )
}
