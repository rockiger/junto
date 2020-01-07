import Dexie from 'dexie'

// To make it possible to configure dexie for tests
if (process.env.JEST_WORKER_ID) {
    Dexie.dependencies.indexedDB = require('fake-indexeddb')
    Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
}

export interface IPage {
    id: string

    content: { [key: string]: any }
    // The last time the page is edited in the browser (RFC 3339 date-time).
    editedTime: string
    // The last time the file was modified (RFC 3339 date-time).
    // The setting modifiedTime will be provided by Google Drive API.
    modifiedTime: string
}

class LocalFulcrumDatabase extends Dexie {
    // Declare implicit table properties
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    pages: Dexie.Table<IPage, string> // string = type of the primkey
    // ...other tables could go here

    constructor() {
        super('LocalFulcrumDatabase')
        this.version(1).stores({
            pages: '&id, content, editedTime, modifiedTime',
        })

        // The following line is needed if your typescript
        // is compiled using babel instead of tsc:
        this.pages = this.table('pages')
    }
}

export const localDB = new LocalFulcrumDatabase()

export async function getPageById(id: string): Promise<IPage | undefined> {
    const result = await localDB.pages
        .where('id')
        .equals(id)
        .first()
    return result
}

export async function addPage(page: IPage): Promise<string> {
    const result = await localDB.pages.add(page)
    return result
}

export async function putPage(page: IPage): Promise<string> {
    const result = await localDB.pages.put(page)
    return result
}
