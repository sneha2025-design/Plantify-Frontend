// Wraps Google Identity Services' OAuth2 token flow so the custom-styled
// "Continue with Google" button can trigger the Google account picker and
// get back an access token to send to our backend.
//
// Requires VITE_GOOGLE_CLIENT_ID to be set in frontend/.env (see README).

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

let tokenClient = null

function ensureClient() {
  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Sign-In script has not loaded yet. Please try again in a moment.')
  }
  if (!CLIENT_ID) {
    throw new Error(
      'Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID in frontend/.env (see README).'
    )
  }
  if (!tokenClient) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'openid email profile',
      callback: () => {}, // overridden per-call below
    })
  }
  return tokenClient
}

export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    try {
      const client = ensureClient()
      client.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.access_token)
        }
      }
      client.requestAccessToken()
    } catch (err) {
      reject(err)
    }
  })
}
