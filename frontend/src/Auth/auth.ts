const clientId = process.env.FT_API_CLIENT_ID
const redirectURI = 'http://localhost:3000/callback'
const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code`

export function authenticateWith42(): void {
  window.location.href = authURL
}
