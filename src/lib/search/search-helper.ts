import { EXT } from "lib/constants"
import type { IFile } from "reactn/default"

const FOLDER_MIME = "application/vnd.google-apps.folder"

export function isWikiPageForSearch(file: IFile): boolean {
    if (file.trashed) {
        return false
    }
    if (file.mimeType === FOLDER_MIME) {
        return false
    }
    const { mimeType, name } = file
    if (name.endsWith(EXT) && mimeType === "application/json") {
        return true
    }
    if (name.endsWith(".md") && (mimeType as string) === "text/markdown") {
        return true
    }
    if (name.endsWith(".mdf")) {
        return true
    }
    return false
}

/** Drive-backed file list filtered to searchable wiki pages (post-query). */
export function filterSearchResultFiles(files: IFile[]): IFile[] {
    return files.filter(isWikiPageForSearch)
}

export function normalizeSearchQueryParam(q: unknown): string {
    if (typeof q !== "string") {
        return ""
    }
    return q
}
