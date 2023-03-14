const clientId =
  'u-s4t2ud-ea9deabfb4de552b9d618e65dc6b9f2cf3cc3afe0d38613404f898ac5b43da6b'
const redirectURI = 'http://localhost:3000/callback'
const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code`

export function authenticateWith42(): void {
  window.location.href = authURL
}
