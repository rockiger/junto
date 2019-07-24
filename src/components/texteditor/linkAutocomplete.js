import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';

import { getFolderId, listFiles} from '../../lib/gdrive';
import { getExtFromFilenName, getTitleFromFileName } from '../../lib/helper';
import { EXT } from '../../lib/constants'

class LinkAutocomplete extends React.Component  {

    constructor(props) {
        super(props)

        this.state = {
            value: '',
        }

        this.autocomplete = React.createRef();
    }

    componentDidMount() {
        this.autocomplete.current.focus();
    }

    onChangeAutocomplete = ev => this.setState({ autocompleteValue: ev.target.value })

    render() {
    return (
        <Autocomplete
            ref={this.autocomplete}
            items={this.props.items}
            shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={item => item.id}
            renderItem={(item, highlighted) =>
                <div
                    key={item.id}
                    style={{
                        backgroundColor: highlighted ? '#eee' : 'transparent',
                        color: 'var(--link-color)',
                        display: 'block',
                        padding: '.5rem .25rem',
                        cursor: 'pointer',
                    }}
                >
                    <img style={{ paddingRight: '.25rem', verticalAlign: 'middle' }} src="https://drive-thirdparty.googleusercontent.com/16/type/application/json" alt="Wiki File" />
                    <span style={{ verticalAlign: 'middle' }}>{getTitleFromFileName(item.name)}</span>
                </div>
            }
            value={this.props.value}
            onChange={this.props.onChange}
            onSelect={this.props.onSelect}
            inputProps={{
                style: {
                    borderColor: 'rgb(192, 192, 192) rgb(217, 217, 217) rgb(217, 217, 217)',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    height: '1.25rem',
                    paddingLeft: '.25rem',
                    width: 300,
                },
                onKeyDown: this.onKeyDownInput,
            }}
            menuStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '3px',
                border: '1px solid #e5e5e5',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                padding: '2px 0',
                fontSize: '90%',
                position: 'static',
                overflow: 'auto',
                maxHeight: '50%',
                minWidth: 'unset',
            }}
        />
    )
}
}
LinkAutocomplete.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
}
export default LinkAutocomplete