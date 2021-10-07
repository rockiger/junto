import React, { useEffect } from 'react'
import { PageView } from 'components/Tracking'

export function TermsOfService() {
    document.title = 'Terms Of Service - Fulcrum.wiki'
    useEffect(() => PageView(), [])

    return (
        <>
            <div className="container container__max1280">
                <h1>Terms of Service</h1>
                <h2>1. Terms</h2>
                By using the Tablao add-on, you are agreeing to be bound by
                these terms of service, all applicable laws and regulations, and
                agree that you are responsible for compliance with any
                applicable local laws. If you do not agree with any of these
                terms, you are prohibited from using or accessing this site. The
                materials contained in this website are protected by applicable
                copyright and trademark law.<h2>2. Use License</h2>
                <ol type="a">
                    <li>Permission is granted to use Tablao free of charge.</li>
                    <li>
                        This license shall automatically terminate if you
                        violate any of these restrictions and may be terminated
                        by Fulcrum.wiki at any time. Upon terminating your
                        viewing of these materials or upon the termination of
                        this license, you must destroy any downloaded materials
                        in your possession whether in electronic or printed
                        format.
                    </li>
                </ol>
                <h2>3. Disclaimer</h2>
                <ol type="a">
                    <li>
                        The materials on Fulcrum.wiki’s website are provided on
                        an ‘as is’ basis. Fulcrum.wiki makes no warranties,
                        expressed or implied, and hereby disclaims and negates
                        all other warranties including, without limitation,
                        implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of
                        intellectual property or other violation of rights.
                    </li>
                    <li>
                        Further, Fulcrum.wiki does not warrant or make any
                        representations concerning the accuracy, likely results,
                        or reliability of the use of the materials on its
                        website or otherwise relating to such materials or on
                        any sites linked to this site.
                    </li>
                </ol>
                <h2>4. Limitations</h2>
                In no event shall Fulcrum.wiki or its suppliers be liable for
                any damages (including, without limitation, damages for loss of
                data or profit, or due to business interruption) arising out of
                the use or inability to use the materials on Fulcrum.wiki’s
                website, even if Fulcrum.wiki or a Fulcrum.wiki authorized
                representative has been notified orally or in writing of the
                possibility of such damage. Because some jurisdictions do not
                allow limitations on implied warranties, or limitations of
                liability for consequential or incidental damages, these
                limitations may not apply to you.
                <h2>5. Accuracy of materials</h2>
                The materials appearing on Fulcrum.wiki’s website could include
                technical, typographical, or photographic errors. Fulcrum.wiki
                does not warrant that any of the materials on its website are
                accurate, complete or current. Fulcrum.wiki may make changes to
                the materials contained on its website at any time without
                notice. However Fulcrum.wiki does not make any commitment to
                update the materials.<h2>6. Links</h2>
                Fulcrum.wiki has not reviewed all of the sites linked to its
                website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by Fulcrum.wiki of the site. Use of any such linked
                website is at the user’s own risk.<h2>7. Modifications</h2>
                Fulcrum.wiki may revise these terms of service for its website
                at any time without notice. By using this website you are
                agreeing to be bound by the then current version of these terms
                of service.<h2>8. Governing Law</h2>
                These terms and conditions are governed by and construed in
                accordance with the laws of Germany and you irrevocably submit
                to the exclusive jurisdiction of the courts in that State or
                location.Generated by{' '}
                <a
                    title="Terms of Service Template Generator"
                    href="https://getterms.io/"
                >
                    GetTerms.io
                </a>
            </div>
            <style>{`
            body {
                overflow-y: auto;
                font-size: 1rem;
            }
            .App-main {
                padding: 0;
                margin-top: 7rem;
            }
            .hero-container {
                padding: 8rem 6%
            }
            .SignInWithGoogle:hover {
                background-color: rgb(46, 93, 170) !important;
            }
            .SignInWithGoogle svg{
                height: 18px;
                width: 18px;
            }
            
            .hero-logo {
                padding-top: 80px;
                margin-bottom: 20px;
            }
            `}</style>
        </>
    )
}
