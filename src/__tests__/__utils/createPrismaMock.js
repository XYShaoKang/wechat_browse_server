/**
 * @typedef {import ('../../../generated/prisma-client').WeChatUser} WeChatUser
 * @typedef {import ('../../../generated/prisma-client').ChatRoom} ChatRoom
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
        chatRoom => this.createChatRooms(chatRoom),
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

  createChatRooms = jest.fn(chatRoom => {
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

  createAvatar = jest.fn(({ create }) => {
    const id = this.db.avatars.length + ''

    const data = map(obj => {
      if (obj.create) {
        return { id: this.createFileIndex(obj).id }
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

  createFileIndex = jest.fn(file => {
    const id = this.db.fileIndexs.length + ''
    const newFile = { ...file, id }
    this.db.fileIndexs.push(newFile)
    return newFile
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
