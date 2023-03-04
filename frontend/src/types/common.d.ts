type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface GlobalContext {
  user: User
  setUser: Setter<User>
  signedIn: boolean
  setSignedIn: Setter<boolean>
}
