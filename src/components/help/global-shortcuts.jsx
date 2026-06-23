import React from 'react'

export function GlobalShortcuts() {
    return (
        <>
            <h1>Global Shortcuts</h1>
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>Shortcut</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>Create a new page</td>
                        <td>c</td>
                    </tr> */}
                    <tr>
                        <td>Edit the current page</td>
                        <td>e</td>
                    </tr>
                    <tr>
                        <td>Open search</td>
                        <td>/</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}
