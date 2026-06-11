/** Google API client (loaded at runtime via script tag). */
export interface GapiClient {
    load: (module: string, callback?: () => void) => void
    client?: {
        init: (config: {
            apiKey?: string
            discoveryDocs?: string[]
        }) => Promise<void>
        setToken: (token: { access_token: string } | null) => void
        drive: {
            files: {
                create: (params: Record<string, unknown>) => Promise<{ body: string }>
                list: (params: Record<string, unknown>) => Promise<{ body: string }>
            }
            permissions: {
                create: (params: Record<string, unknown>) => Promise<unknown>
            }
        }
    }
    drive?: {
        share?: {
            ShareClient: new () => {
                setOAuthToken: (token: string) => void
                setItemIds: (ids: string[]) => void
            }
        }
    }
}

interface GoogleAccountsOAuth2 {
    revoke: (token: string, callback: () => void) => void
}

declare global {
    const gapi: GapiClient

    interface Window {
        gapi?: GapiClient
        google?: {
            accounts?: {
                oauth2?: GoogleAccountsOAuth2
            }
            picker?: Record<string, unknown>
        }
        share?: {
            showSettingsDialog: () => void
        }
    }

    interface HTMLScriptElement {
        /** Legacy IE property; still used for script load detection. */
        readyState?: string
    }
}

export {}
