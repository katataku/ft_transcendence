import { type ReactElement } from 'react'
import { Button } from 'react-bootstrap'
import { AdminIcon } from '../utils/AdminIcon'
import { BannedIcon } from '../utils/BannedIcon'
import { OwnerIcon } from '../utils/OwnerIcon'
import {
  deleteChatRoomMembersRequest,
  updateChatRoomMembersRequest
} from './requestUtils'

const BanMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          isBanned: true,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Ban
    </Button>
  )
}

const BanOFFMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          isBanned: false,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Ban 解除
    </Button>
  )
}

const BanButton = (props: {
  room: ChatRoom
  member: User
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.member.id
  if (isOwner) return <></>

  const isBanned = props.chatRoomMemberList.find(
    (item) =>
      item.userId === props.member.id && item.chatRoomId === props.room.id
  )?.isBanned
  if (isBanned === undefined) return <></>
  return isBanned ? (
    <>
      <BannedIcon isBanned={isBanned} />
      <BanOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <BanMemberButton {...props} member={props.member} />
    </>
  )
}

const AdminMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-info"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          isBanned: false,
          isAdministrator: true
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Admin
    </Button>
  )
}

const AdminOFFMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMember = {
          chatRoomId: props.room.id,
          userId: props.member.id,
          isBanned: false,
          isAdministrator: false
        }
        updateChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Admin 解除
    </Button>
  )
}

const AdminButton = (props: {
  room: ChatRoom
  member: User
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.member.id
  if (isOwner) return <></>

  const isAdmin = props.chatRoomMemberList.find(
    (item) =>
      item.userId === props.member.id && item.chatRoomId === props.room.id
  )?.isAdministrator
  if (isAdmin === undefined) return <></>
  return isAdmin ? (
    <>
      <AdminIcon isAdmin={isAdmin} />
      <AdminOFFMemberButton {...props} member={props.member} />
    </>
  ) : (
    <>
      <AdminMemberButton {...props} member={props.member} />
    </>
  )
}

const DeleteMemberButton = (props: {
  room: ChatRoom
  member: User
  updateMemberList: () => void
}): JSX.Element => {
  const isOwner: boolean = props.room.created_by_user_id === props.member.id
  if (isOwner) return <></>

  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        const requestData: ChatRoomMemberPK = {
          chatRoomId: props.room.id,
          userId: props.member.id
        }
        deleteChatRoomMembersRequest(requestData, props.updateMemberList)
      }}
    >
      Delete User from Room
    </Button>
  )
}

export const UserListDisplay = (props: {
  room: ChatRoom
  userList: User[]
  chatRoomMemberList: ChatRoomMember[]
  updateMemberList: () => void
}): ReactElement => {
  return (
    <ul>
      {props.userList.map((member, index) => {
        return (
          <li key={index}>
            {member.name}
            <OwnerIcon room={props.room} user={member}></OwnerIcon>
            <BanButton {...props} member={member} />
            <AdminButton {...props} member={member} />
            <DeleteMemberButton {...props} member={member} />
          </li>
        )
      })}
    </ul>
  )
}
