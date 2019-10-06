import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { TextField } from '@material-ui/core'

class LinkAutocomplete extends React.Component {
    constructor(props) {
        super(props)

        this.autocomplete = React.createRef()
    }

    componentDidMount() {
        setTimeout(() => document.getElementById('Autocomplete').focus(), 100)
    }

    onEnter = event => {
        // Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
        if (event.keyCode !== 13) return
        // In case the user is currently hovering over the menu
        this.autocomplete.current.setIgnoreBlur(false)
        if (!this.autocomplete.current.isOpen()) {
            // menu is closed so there is no selection to accept -> do nothing
            return
        } else if (this.autocomplete.current.state.highlightedIndex == null) {
            event.stopPropagation()
            // input has focus but no menu item is selected + enter is hit -> close the menu, highlight whatever's in input
            this.autocomplete.current.setState({
                isOpen: false,
            })
        } else {
            // text entered + menu item has been highlighted + enter is hit -> update value to that of selected menu item, close the menu
            event.preventDefault()
            event.stopPropagation()
            const item = this.autocomplete.current.getFilteredItems(
                this.autocomplete.current.props
            )[this.autocomplete.current.state.highlightedIndex]
            const value = this.autocomplete.current.props.getItemValue(item)
            this.autocomplete.current.setState(
                {
                    isOpen: false,
                    highlightedIndex: null,
                },
                () => {
                    //this.refs.input.focus() // TODO: file issue
                    /* this.refs.input.setSelectionRange(
                        value.length,
                        value.length
                    ) */
                    this.autocomplete.current.props.onSelect(value, item)
                }
            )
        }
    }

    render() {
        return (
            <Autocomplete
                ref={this.autocomplete}
                items={this.props.items}
                shouldItemRender={(item, value) =>
                    item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
                }
                getItemValue={item => item.id}
                renderItem={(item, highlighted) => (
                    <div
                        key={item.id}
                        style={{
                            backgroundColor: highlighted
                                ? '#eee'
                                : 'transparent',
                            color: 'var(--link-color)',
                            display: 'block',
                            padding: '.5rem .25rem',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            style={{
                                paddingRight: '.25rem',
                            }}
                        >
                            <item.icon />
                        </span>
                        <span style={{ verticalAlign: 'super' }}>
                            {item.name}
                        </span>
                    </div>
                )}
                renderMenu={function(items, value, style) {
                    const display = items.length < 1 ? { display: 'none' } : {}
                    return (
                        <div
                            style={{ ...style, ...this.menuStyle, ...display }}
                            children={items}
                        />
                    )
                }}
                value={this.props.value}
                onChange={this.props.onChange}
                onSelect={this.props.onSelect}
                inputProps={{
                    autoFocus: true,
                    id: 'Autocomplete',
                    inputProps: {
                        onKeyDown: this.onEnter,
                    },
                    label: 'Link',
                    margin: 'dense',
                    name: 'href',
                    placeholder:
                        this.props.items.length > 0
                            ? 'Paste a link, or search'
                            : 'Paste a link',
                    style: { width: 310 },
                    variant: 'outlined',
                    InputLabelProps: { shrink: true },
                }}
                menuStyle={{
                    background: 'rgba(255, 255, 255, 1)',
                    borderRadius: '3px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    fontSize: '90%',
                    maxHeight: 214,
                    overflow: 'auto',
                    padding: '2px 0',
                    position: 'fixed',
                    width: 310,
                    zIndex: 1,
                }}
                renderInput={props => <TextField {...props} />}
            />
        )
    }
}
LinkAutocomplete.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
}
export default LinkAutocomplete
