const clientId =
  'u-s4t2ud-56b91c1f7ae4d450f155af7320a16bce85f13806029385c1a31d4f9bb2279df5' // config/ 以下に記述してコンテナの再起動を行なってもなぜかprocess.envで読み込めないのでベタ書きします。
const redirectURI = 'http://localhost:3000/callback'
const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${
  clientId as string
}&redirect_uri=${redirectURI}&response_type=code`

export function authenticateWith42(): void {
  console.log(clientId)
  window.location.href = authURL
}
