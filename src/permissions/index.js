import { rule, shield } from 'graphql-shield'

const isAuthenticatedUser = rule()(async (parent, args, { currentUser }) => {
  return Boolean(currentUser)
})
export const permissions = shield({
  Query: {
    users: isAuthenticatedUser,
    weChatUsers: isAuthenticatedUser,
  },
  Mutation: {
    addWechatUsers: isAuthenticatedUser,
  },
})
