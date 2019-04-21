/**
 * @typedef {import ('../../../generated/prisma-client').WeChatUser} WeChatUser
 * @typedef {import ('../../../generated/prisma-client').ChatRoom} ChatRoom
 */

import { db } from '../__mocks'

class Prisma {
  constructor() {}

  user = jest.fn(({ id, email }) => {
    const user = db.users.find(user => user.id === id || user.email === email)
    if (user) {
      return {
        ...user,
        weChat: () => this.weChats({ id_in: user.weChat }),
      }
    }
    return null
  })

  users = jest.fn(() => db.users)

  createUser = jest.fn(user => {
    const id = db.users.length + ''
    const newUser = { id, ...user, weChat: [] }
    db.users.push(newUser)
    return newUser
  })

  weChat = jest.fn(() => {})

  weChats = jest.fn(({ id_in }) => {
    return db.weChats.filter(id => id_in.includes(id))
  })

  updateWeChat = jest.fn(({ where, data }) => {
    const weChat = db.weChats.find(({ id }) => id === where.id)
    if (!weChat) {
      return null
    }
    if (data.weChatUsers && data.weChatUsers.create) {
      const weChatUsers = data.weChatUsers.create
      weChatUsers.forEach(
        /**
         * @param {WeChatUser} user
         */
        user => this.createWeChatUser(user),
      )
    }
    if (data.chatRooms) {
      const chatRooms = data.chatRooms.create
      chatRooms.forEach(
        /**
         * @param {ChatRoom} chatRoom
         */
        chatRoom => this.CreateChatRooms(chatRoom),
      )
    }

    return {
      id: weChat.id,
    }
  })

  createWeChatUser = jest.fn(user => {
    const id = db.weChatUsers.length + ''
    const newWeChatUser = { ...user, id }
    db.weChatUsers.push(newWeChatUser)
    return newWeChatUser
  })

  CreateChatRooms = jest.fn(chatRoom => {
    const id = db.chatRooms.length + ''
    const newWeChatRoom = { ...chatRoom, id }
    db.chatRooms.push(newWeChatRoom)
    return newWeChatRoom
  })
}
export { Prisma }
