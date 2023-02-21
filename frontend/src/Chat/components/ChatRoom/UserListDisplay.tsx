import { type ReactElement } from 'react'

export const UserListDisplay = (props: { userList: User[] }): ReactElement => {
  return (
    <ul>
      {props.userList.map((member, index) => {
        return <li key={index}>{member.name}</li>
      })}
    </ul>
  )
}
