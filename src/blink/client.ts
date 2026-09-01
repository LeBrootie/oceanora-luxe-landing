import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'oceanora-luxe-landing-8fl6xyuz',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_Amrjcz03ChWmOZfD131mIBpyP_P3bwlZ',
  authRequired: false,
  auth: { mode: 'managed' },
})
