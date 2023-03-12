import { useContext, type ReactElement } from 'react'
import { Container, Navbar, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GlobalContext } from './App'
import { BaseURL } from './constants'

export function Header(): ReactElement {
  const { loginUser } = useContext(GlobalContext)
  const imageURL = `${BaseURL}/user/user_avatar/${loginUser.id}`

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
        <Link to={'profile/' + String(loginUser.id)}>
          <Image
            src={`${imageURL}`}
            style={{ borderRadius: '50%', margin: '30px' }}
            height={50}
          />
        </Link>
      </Container>
    </Navbar>
  )
}
