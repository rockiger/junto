import React from 'react'
import { storiesOf } from '@storybook/react'
import 'index.scss'

import { Tab, Tabs, TabList, TabPanel } from './tabs'

storiesOf('Tabs', module)
    .addDecorator(story => (
        <div
            style={{
                border: '1px solid rgba(0,0,0, 0.2',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Selection</Tab>
                        <Tab>Go to</Tab>
                        <Tab>Application</Tab>
                        <Tab>Create</Tab>
                        <Tab>Upload</Tab>
                        <Tab>Menus</Tab>
                        <Tab>Actions</Tab>
                    </TabList>

                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                </Tabs>
            </>
        )
    })
    .add('vertical', () => {
        return (
            <>
                <Tabs vertical>
                    <TabList>
                        <Tab>Selection</Tab>
                        <Tab>Go to</Tab>
                        <Tab>Application</Tab>
                        <Tab>Create</Tab>
                        <Tab>Upload</Tab>
                        <Tab>Menus</Tab>
                        <Tab>Actions</Tab>
                    </TabList>

                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                    <TabPanel>
                        <TabContent />
                    </TabPanel>
                </Tabs>
            </>
        )
    })

function TabContent() {
    return (
        <>
            <p>
                Am Montag um 12 Uhr wird sich in Potsdam entscheiden, ob Andreas
                Kalbitz Mitglied der AfD-Fraktion im Brandenburger Landtag
                bleiben kann - oder besser gesagt: Es wird entschieden, ob er
                wieder Mitglied wird. Dann tritt die AfD-Landtagsfraktion zur
                Krisensitzung zusammen. Kalbitz wird als Gast erwartet. Seit am
                Freitag die Entscheidung des Bundesvorstands fiel, die
                AfD-Mitgliedschaft des Rechtsaußen für nichtig zu erklären,
                gehört er formal auch nicht mehr dem Gremium an.
            </p>

            <p>
                Am Montag um 12 Uhr wird sich in Potsdam entscheiden, ob Andreas
                Kalbitz Mitglied der AfD-Fraktion im Brandenburger Landtag
                bleiben kann - oder besser gesagt: Es wird entschieden, ob er
                wieder Mitglied wird. Dann tritt die AfD-Landtagsfraktion zur
                Krisensitzung zusammen. Kalbitz wird als Gast erwartet. Seit am
                Freitag die Entscheidung des Bundesvorstands fiel, die
                AfD-Mitgliedschaft des Rechtsaußen für nichtig zu erklären,
                gehört er formal auch nicht mehr dem Gremium an.
            </p>

            <p>
                Seinen Landesvorsitz haben seine Stellvertreter bereits
                übernommen. In die Landtagsfraktion könnte er als parteiloses
                Mitglied wieder aufgenommen werden, heißt es dort. Ob er als
                Parteiloser sogar wieder den Fraktionsvorsitz übernehmen wird,
                ist nach SPIEGEL-Informationen noch nicht ausgemacht. Im
                gegnerischen Lager kursieren jedenfalls schon Namen für die
                mögliche Neubesetzung.
            </p>
        </>
    )
}
