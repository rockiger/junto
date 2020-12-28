import React from 'react'

import { Button } from 'components/gsuite-components'

import CreateNewWiki1 from './CreateNewWiki1.png'
import CreateNewWiki2 from './CreateNewWiki2.png'

export { FulcrumFaq }

function FulcrumFaq() {
    return (
        <>
            <h2>How can I delete single pages?</h2>
            <p>
                Right now, it is not possible to delete pages from inside
                Fulcrum. But you can archive them, which will remove them from
                your wiki structure and place them in your archive. To archive a
                page click on the archive icon in the upper right corner of a
                wiki page.
            </p>
            <p>
                To delete a page from your Google Drive, go to your wiki folder
                in Google Drive and search for the title of the page and delete
                it.
            </p>
            <h2>How can I delete all sub-pages of a page?</h2>
            <p>
                Right now, it is not possible to delete all sub-pages from
                inside Fulcrum. But you can archive them, which will remove them
                from your wiki structure and place them in your archive. To
                archive a page and it's sub pages click on the archive icon in
                the upper right corner of the wiki page.
            </p>

            <p>
                To remove them from your Google Drive you need to find the
                folder with the same name as your page ID in your Google Drive.
                You find the page ID at the end of the page URL, e.g.{' '}
                <i>https://www.fulcrum.wiki/page/[page-ID]</i>.
            </p>
            <h2>How can I move wikis in Google Drive?</h2>
            <p>
                To move a wiki in your Google Drive you can simply move its
                folder. For <strong>My Wiki</strong>, the folder name is{' '}
                <strong>Fulcrum Documents</strong>. For all other wikis, it is
                the same as the name of the wiki.
            </p>
            <h2>How can I move pages?</h2>
            <p>
                You can move wiki pages via <strong>Google Drive</strong>.
                Unfortunately, this is a bit tedious right now. You need to find
                the file, you want to move, in Google Drive and move it to the
                right folder. Then you can move this file to the target folder.{' '}
            </p>
            <p>
                To find that folder you need to search for a folder with the
                same name as the page ID of your target page. You find the page
                ID at the end of the page URL, e.g.{' '}
                <i>https://www.fulcrum.wiki/page/[page-ID]</i>.
            </p>
            <p>
                We are working on this feature right, that you don't have to
                engage in this tedious process.
            </p>
            <h2>How can I rename wikis or the root page of a wiki?</h2>
            <p>
                Right now, this is not possible. You can't rename{' '}
                <strong>My Fulcrum</strong> nor the name of a wiki. We are
                working on this feature, which will make it possible.
            </p>
            <h2>How do I create a new (shared) wiki?</h2>
            <p>
                To add a new wiki, you have to add it from Google Drive. Simply
                navigate to the folder on your personal or shared drive where
                you want to add the new wiki.{' '}
            </p>
            <p>
                Then click the "<strong>New</strong>" button and then on "
                <strong>More </strong>> <strong>Fulcrum Wiki</strong>". In the
                occurring dialog give your wiki a name and you are good to go.{' '}
            </p>
            <p>
                <img
                    alt="Create New Wiki 1/2"
                    className="shadow"
                    src={CreateNewWiki1}
                />
            </p>

            <p>
                <img
                    alt="Create New Wiki 2/2"
                    className="shadow"
                    src={CreateNewWiki2}
                />
            </p>
            <p>
                You can add as many wikis in different places as you want. But
                please don't create new wikis in folders that are already used
                as wikis!
            </p>
            <h2>
                I can not share pages. The share dialog always shows an error or
                is blank.
            </h2>
            <p>
                For the Google share dialog to function properly you need to
                deactivate your ad blocker.{' '}
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
                    primary
                    style={{ display: 'inline' }}
                >
                    Ask Question
                </Button>
            </p>
            <p>
                <i>Last modified on June 25, 2020&nbsp;</i>
            </p>
        </>
    )
}
