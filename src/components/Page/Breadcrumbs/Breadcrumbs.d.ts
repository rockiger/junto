export interface IProps {
    fileId: string
    files: Array<IMeta>
}

/**
 * The meta information of a file
 */
export interface IMeta {
    id: string
    name: string
    parents: Array<string> // the id of the parrent of a file
    mimeType: 'application/vnd.google-apps.folder' | 'application/json'
    [key: string]: any
}

export type IMetaOrNull = IMeta | null
