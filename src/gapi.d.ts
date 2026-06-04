/** Google API client (loaded at runtime via script tag). */
export interface GapiClient {
    load: (module: string, callback?: () => void) => void
    client?: {
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
}

declare global {
    const gapi: GapiClient

    interface Window {
        gapi?: GapiClient
    }

    interface HTMLScriptElement {
        /** Legacy IE property; still used for script load detection. */
        readyState?: string
    }
}

export {}
