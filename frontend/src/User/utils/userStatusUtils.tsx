export function isBlockUser(
  blockedUser: User,
  blockUserList: blockUserList[]
): boolean {
  return blockUserList.some((item) => item.blockedUserId === blockedUser.id)
}
