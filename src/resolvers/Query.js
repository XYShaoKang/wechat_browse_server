const users = async (_, __, { dataSources }) => await dataSources.prisma.users()

const me = async (_, __, { currentUser }) => currentUser

export default { users, me }
