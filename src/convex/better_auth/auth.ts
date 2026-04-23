import { create_auth } from '../auth.js'

// Export a static instance for Better Auth schema generation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = create_auth({} as any)
