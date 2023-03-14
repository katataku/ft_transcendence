const clientId =
  'u-s4t2ud-1ed845d5be5a95148cf45897b0b6cad7f77a31d4a224938f7d0054c0ca039c35'
const redirectURI = 'http://localhost:3000/callback'
const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code`

export function authenticateWith42(): void {
  window.location.href = authURL
}
