import { downloadFile, updateFileMultipart } from 'lib/gdrive'
import { slate0ValueToMarkdown } from './slateToMarkdown.mjs'

const GWIKI_EXT = /\.gwiki$/i

/** @param {import('reactn/default').IFile[]} files */
export function findGwikiFiles(files) {
    if (!Array.isArray(files)) return []
    return files.filter(
        file =>
            !file.trashed &&
            file.mimeType !== 'application/vnd.google-apps.folder' &&
            GWIKI_EXT.test(file.name)
    )
}

/**
 * Converts one .gwiki Drive file to Markdown in place:
 * one multipart update with new content, `.md` name and `text/markdown`
 * mimeType. The Drive file id stays stable, so internal `/page/{id}` links
 * keep working; the old Slate JSON remains available as a Drive revision.
 *
 * @param {import('reactn/default').IFile} file
 * @returns {Promise<object>} updated file description
 */
export async function migrateGwikiFile(file) {
    const raw = await downloadFile(file.id)
    const markdown = slate0ValueToMarkdown(raw)
    const newName = file.name.replace(GWIKI_EXT, '.md')
    const description = await updateFileMultipart(file.id, markdown, {
        mimeType: 'text/markdown',
        name: newName,
    })
    // stale Slate-JSON draft would otherwise shadow the new Markdown content
    localStorage.removeItem(file.id)
    return description
}

/**
 * Migrates all given .gwiki files sequentially. Failing files are skipped
 * and logged; they keep their .gwiki name so a reload retries them.
 *
 * @param {import('reactn/default').IFile[]} targets
 * @param {(done: number, total: number) => void} [onProgress]
 */
export async function migrateGwikiFiles(targets, onProgress) {
    const failed = []
    let done = 0
    for (const file of targets) {
        try {
            await migrateGwikiFile(file)
        } catch (err) {
            console.error(`Migration failed for ${file.name} (${file.id})`, err)
            failed.push({ file, err })
        }
        done++
        if (onProgress) onProgress(done, targets.length)
    }
    return { failed, migrated: done - failed.length, total: targets.length }
}
