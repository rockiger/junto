export const queryKeys = {
    filesTree: ['files', 'tree'] as const,
    filesSearch: (q: string) => ['files', 'search', q] as const,
    rootFolderId: ['drive', 'rootFolderId'] as const,
}
