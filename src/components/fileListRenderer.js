import React from 'react'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FileDocumentIcon from 'mdi-react/FileDocumentIcon'

import Spinner from './spinner'
import { EXT } from '../lib/constants';
import { getTitleFromFileName, getExtFromFilenName } from '../lib/helper';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

const FileListRenderer = props => {
    const classes = useStyles();
    return (
        <div className="filelist">
            <h1>Your work</h1>
            <div className="filelist-tagline">Last edited</div>
            {props.isLoading && <Spinner />}
            {!props.isLoading && <List className="filelist-list">
                {props.files
                    .filter(file => {
                        console.log('file.name:', file.name)
                        const ext = getExtFromFilenName(file.name);
                        console.log('ext:', ext);
                        
                        return (ext === EXT)
                    })
                    .map(file => {
                        const filename = getTitleFromFileName(file.name);
                        return (
                            <ListItem className={classes.listitem} key={file.id}>
                                <Link className={classes.link}
                                    to={`/page/${file.id}`}
                                >
                                    <ListItemIcon className={classes.icon} 
                                    >
                                        <FileDocumentIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={filename} />
                                </Link>
                            </ListItem>
                        );
                    })}
            </List>}
            <style>{`
                    .filelist h1 {
                        border-bottom: 1px solid var(--border-color);
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .5rem;
                    }
                    .filelist-tagline {
                        margin-top: 1rem;
                        font-weight: 600;
                    }
                    .filelist-list a {
                        border-radius: var(--border-radius);
                        color: var(--link-color);
                        font-size: 1rem;
                        padding: .5rem 1rem .5rem .75rem;
                    }
                    .filelist-list a:hover {
                        background-color: var(--hover-bg-color);
                        text-decoration: none;
                    }
                    .filelist-list a img, .filelist-list a span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                `}</style>
        </div>
    );
}
export default FileListRenderer

function useStyles() {
    const useStyles = makeStyles(theme => {
        console.log(theme);

        return ({
            icon: {
                color: theme.palette.primary.main,
                minWidth: theme.spacing(4),
            },
            link: {
                display: 'flex',
                flexGrow: 1,
                textDecoration: 'none',
                alignItems: 'center',
            },
            listitem: {
                padding: 0,
                paddingRight: theme.spacing(2),
            }
        })
    })
    return useStyles();
}