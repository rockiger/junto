import React from 'react'

import { Button } from 'components/gsuite-components'

export { FulcrumFaq }

function FulcrumFaq() {
    return (
        <>
            <h1>Fulcrum FAQ</h1>
            <h2>How can I delete single pages?</h2>
            <p>
                Right now, it is not possible to delete single pages from
                Fulcrum itself.
            </p>
            <p>
                To delete a page, go to your wiki folder in Google Drive and
                search for the title of the page and delete it.
            </p>
            <h2>How can I delete all sub-pages of a page?</h2>
            <p>
                Right now, it is not possible to delete all sub-pages from
                Fulcrum itself. To delete them you need to find the folder with
                the same name of your page in your Google Drive. You find it at
                the end of the page URL, e.g.
                https://www.fulcrum.wiki/page/[page-Id].
            </p>

            <h2>How can I move wikis?</h2>
            <p>
                To move a wiki in your Google Drive you can simply&nbsp;move its
                folder. For <strong>My Wiki</strong> the folder name is{' '}
                <strong>Fulcrum Documents</strong>. For all other wikis it is
                the same as the name of the wiki.
            </p>

            <h2>
                I can not share pages. The share dialog always shows an error or
                is blank.
            </h2>
            <p>
                For the Google share dialog to function properly you need to
                deactivate your ad blocker.&nbsp;
            </p>
            <p>The share dialog doesn't work on Shared Drives.</p>
            <h2>I have another question. Where can I get help?</h2>
            <p>
                You can get answers to your question here.{' '}
                <Button
                    onClick={() =>
                        window.open(
                            'https://docs.google.com/forms/d/e/1FAIpQLSfqL6-8Ls00xgL2cWiNkR5cmC5bUpyRl71KTVnzIIKfdef-1Q/viewform?usp=sf_link',
                            '_blank'
                        )
                    }
                    style={{ display: 'inline' }}
                >
                    Ask Question
                </Button>
            </p>
            <p>
                <i>Last modified on May 22, 2020&nbsp;</i>
            </p>
        </>
    )
}
