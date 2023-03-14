const clientId =
  'u-s4t2ud-ba0d793efec8b7c0a682380e3483693f0acdeed1df8811490d8f64eac51df8be' // config/ 以下に記述してコンテナの再起動を行なってもなぜかprocess.envで読み込めないのでベタ書きします。
const redirectURI = 'http://localhost:3000/callback'
const authURL = `https://api.intra.42.fr/oauth/authorize?client_id=${
  clientId as string
}&redirect_uri=${redirectURI}&response_type=code`

export function authenticateWith42(): void {
  console.log(clientId)
  window.location.href = authURL
}
