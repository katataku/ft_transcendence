// フリー素材のアイコン。
// ただし、LICENSEで再配布が禁止されているため、publicディレクトリに保存せずに、画像URLへ直接リンクする。
// https://iconbox.fun/about/#LICENSE
const _publicIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_open_24.png'
const privateIconURL: string =
  'https://iconbox.fun/wp/wp-content/uploads/lock_24.png'

export const PrivateIcon = (props: { isPrivate: boolean }): JSX.Element => {
  return props.isPrivate ? (
    <img src={privateIconURL} alt="new" width="20" height="20" />
  ) : (
    <></>
  )
}
