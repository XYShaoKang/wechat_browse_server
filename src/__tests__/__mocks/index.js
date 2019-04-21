export const db = {
  users: [
    {
      id: '0',
      name: 'a',
      email: 'a@a.com',
      password: 'abcd',
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
      weChat: ['0'],
    },
  ],
  weChats: [
    {
      id: '0',
      weChatOwner: {
        id: '0',
      },
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
    },
  ],
  /**
   * @type {Array}
   */
  chatRooms: [],
  weChatUsers: [
    {
      id: '0',
      username: 'a',
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
    },
  ],
}
