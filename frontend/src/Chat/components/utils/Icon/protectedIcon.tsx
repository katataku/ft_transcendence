// http://freeiconbox.com/archive/icon4781212831560.html
const protectedIconPath: string = '/protected_icon.png'

export const ProtectedIcon = (props: { isProtected: boolean }): JSX.Element => {
  return props.isProtected ? (
    <img src={protectedIconPath} alt="new" width="30" height="30" />
  ) : (
    <></>
  )
}
