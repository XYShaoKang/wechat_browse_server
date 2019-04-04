import { authenticated } from '../utils'

const users = async (_, __, { dataSources }) => await dataSources.prisma.users()

const me = async (_, __, { currentUser }) => currentUser

module.exports = { users: authenticated(users), me: authenticated(me) }
