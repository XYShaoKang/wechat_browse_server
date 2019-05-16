/**
 * @typedef {import ('../../../generated/prisma-client').WeChatUser} WeChatUser
 * @typedef {import ('../../../generated/prisma-client').ChatRoom} ChatRoom
 * @typedef {import ('../../../generated/prisma-client').ChatRoom} Message
 */

import * as R from 'ramda'

import { db } from '../__mocks'

class Prisma {
  constructor() {
    this.db = db()
  }

  user = jest.fn(({ id, email }) => {
    const user = this.db.users.find(
      user => user.id === id || user.email === email,
    )
    if (user) {
      return {
        ...user,
        weChat: () => this.weChats({ id_in: user.weChat }),
      }
    }
    return null
  })

  users = jest.fn(() => this.db.users)

  createUser = jest.fn(user => {
    const id = this.db.users.length + ''
    const newUser = { id, ...user, weChat: [] }
    this.db.users.push(newUser)
    return newUser
  })

  weChat = jest.fn(() => {})

  weChats = jest.fn(({ id_in }) => {
    return this.db.weChats.filter(id => id_in.includes(id))
  })

  updateWeChat = jest.fn(({ where, data }) => {
    const weChat = this.db.weChats.find(({ id }) => id === where.id)
    if (!weChat) {
      return null
    }
    if (data.weChatUsers) {
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
        chatRoom => this.createChatRoom(chatRoom),
      )
    }
    if (data.messages) {
      const messages = data.messages.create
      messages.forEach(
        /**
         * @param {Message} message
         */
        message => this.createMessage(message),
      )
    }

    return {
      id: weChat.id,
    }
  })

  weChatUser = jest.fn(where =>
    this.db.weChatUsers.find(
      ({ id, username }) => id === where.id || username === where.username,
    ),
  )

  weChatUsers = jest.fn(
    /**
     * @param {{where:{username_in:Array.<string>}}} arg
     */
    async ({ where: { username_in } }) =>
      this.db.weChatUsers.filter(({ username }) =>
        username_in.includes(username),
      ),
  )

  createWeChatUser = jest.fn(user => {
    const id = this.db.weChatUsers.length + ''
    const data = map(obj => {
      // console.log(JSON.stringify(obj, null, 2))
      if (obj.avatar) {
        obj.avatar = { id: this.createAvatar(obj.avatar).id }
      }
      return obj
    }, user)
    const newWeChatUser = { ...data, id }
    this.db.weChatUsers.push(newWeChatUser)
    return newWeChatUser
  })
  connectWeChatUser = jest.fn(({ connect: { id, username } }) => {
    const weChatUser = this.db.weChatUsers.find(
      user => id === user.id || username === user.username,
    )
    return weChatUser
  })

  createChatRoom = jest.fn(chatRoom => {
    const id = this.db.chatRooms.length + ''

    const data = map(obj => {
      if (obj.avatar) {
        obj.avatar = { id: this.createAvatar(obj.avatar).id }
      }
      if (obj.memberList) {
        obj.memberList = obj.memberList.connect.map(
          /**
           * @param {{id:string,username:string}} arg
           */
          ({ id }) => {
            const weChatUser = this.weChatUser({ id })
            if (weChatUser) {
              return { id: weChatUser.id }
            } else {
              throw new Error('not find weChatUser')
            }
          },
        )
      }
      return obj
    }, chatRoom)

    const newWeChatRoom = { ...data, id }
    this.db.chatRooms.push(newWeChatRoom)
    return newWeChatRoom
  })
  connectChatRoom = jest.fn(({ connect: { id, username } }) => {
    const charRoom = this.db.chatRooms.find(
      charRoom => id === charRoom.id || username === charRoom.username,
    )
    return charRoom
  })

  createMessage = jest.fn(message => {
    const id = this.db.messages.length + ''

    const data = map(obj => {
      if (obj.talker) {
        const weChatUser = this.connectWeChatUser(obj.talker)

        obj.talker = { id: weChatUser && weChatUser.id }
      }
      if (obj.chatRoom) {
        const charRoom = this.connectChatRoom(obj.chatRoom)
        obj.chatRoom = { id: charRoom && charRoom.id }
      }
      return obj
    }, message)

    const newMessage = { ...data, id }
    this.db.messages.push(newMessage)
    return newMessage
  })

  createAvatar = jest.fn(({ create }) => {
    const id = this.db.avatars.length + ''

    const data = map(obj => {
      if (obj.create) {
        return { id: this.createUrl(obj).id }
      }
      if (obj.connect) {
        return { id: obj.connect.id }
      }
      return obj
    }, create)

    const newAvatar = { ...data, id }
    this.db.avatars.push(newAvatar)
    return newAvatar
  })

  createUrl = jest.fn(({ url }) => {
    const id = this.db.urls.length + ''
    const newUrl = { url, id }
    this.db.urls.push(newUrl)
    return newUrl
  })
}

/**
 * @param {(data: object) => any} fn
 * @param {{ [x: string]: any }} data
 */
function _map(fn, data) {
  const newData = fn(data)
  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      const element = newData[key]
      if (R.is(Object, element)) {
        newData[key] = _map(fn, element)
      }
    }
  }
  return newData
}
/**
 * @param {(data: object) => any} fn
 * @param {object} data
 */
function map(fn, data) {
  return _map(fn, R.clone(data))
}

export { Prisma }
