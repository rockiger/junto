import React from 'react'
import LinkModal from './LinkModal'

export default class LinkButton extends React.Component {
    onClickMarkButton = (editor, event, type) => {
        event.preventDefault()
        const { value } = editor
        if (hasLinks()) {
            editor.command(unwrapLink)
        } else if (value.selection.isExpanded) {
            const selectedText = value.fragment
            //const href = window.prompt('Enter the URL')
            //if (href === null) return
        }
    }

    render() {
        return (
            <>
                <ToolbarButton
                    active={isActive}
                    onMouseDown={event =>
                        onClickMarkButton(editor, event, type)
                    }
                    shortcut={shortcut}
                    style={{ color: isActive ? 'white' : 'black' }}
                    value={type}
                >
                    {icon}
                </ToolbarButton>
                <LinkModal
                    ref={myRef}
                    items={[
                        {
                            id: '1',
                            icon: () => (
                                <img
                                    style={{ verticalAlign: 'sub' }}
                                    src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                                    alt="Wiki File"
                                />
                            ),
                            href: 'https://spielgel.de',
                            name: 'Test 1',
                        },
                        {
                            id: '2',
                            icon: () => (
                                <img
                                    style={{ verticalAlign: 'sub' }}
                                    src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                                    alt="Wiki File"
                                />
                            ),
                            href: 'https://faz.net',
                            name: 'Test 2',
                        },
                    ]}
                />
            </>
        )
    }
}
