export type WikiTreeNode = {
    id: string
    label: string
    parentFolderId: string | null
    children: WikiTreeNode[]
}
