import { rule, shield } from 'graphql-shield'

const isAuthenticatedUser = rule()(async (parent, args, { currentUser }) => {
  return Boolean(currentUser)
})
export const permissions = shield({
  Query: {
    users: isAuthenticatedUser,
    weChatUsers: isAuthenticatedUser,
    chatRooms: isAuthenticatedUser,
    messages: isAuthenticatedUser,
  },
  Mutation: {
    CreateWeChatUsers: isAuthenticatedUser,
    CreateChatRooms: isAuthenticatedUser,
  },
})
