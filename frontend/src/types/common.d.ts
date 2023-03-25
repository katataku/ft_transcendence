type Setter<T> = React.Dispatch<React.SetStateAction<T>>

interface GlobalContext {
  loginUser: User
  setLoginUser: Setter<User>
}
