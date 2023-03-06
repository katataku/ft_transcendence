import { useContext, type ReactElement } from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { GlobalContext } from './App'

export function Header(): ReactElement {
  const { loginUser } = useContext(GlobalContext)

  const loginNameText =
    loginUser.id === 0 ? (
      <Navbar.Text>Not signed in</Navbar.Text>
    ) : (
      <>
        <Navbar.Text>Signed in as: {loginUser.name}</Navbar.Text>
        <Navbar.Text>(User ID: {loginUser.id})</Navbar.Text>
      </>
    )

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">transcendence</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
        {loginNameText}
      </Container>
    </Navbar>
  )
}
