export const db = () => ({
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
  chatRooms: [
    {
      id: '0',
      username: 'b@chatroom',
      nickname: '',
      displayName: '',
      owner: {
        id: '0',
      },
      memberList: [{ id: '0' }, { id: '1' }],
      modifyTime: '2015-04-24T16:51:14.743Z',
    },
  ],
  weChatUsers: [
    {
      id: '0',
      username: 'a',
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
    },
    {
      id: '1',
      username: 'b',
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
    },
    {
      id: '2',
      username: 'c',
      createdAt: '2019-04-21T05:19:31.395Z',
      updatedAt: '2019-04-21T05:19:31.395Z',
    },
  ],
  /**
   * @type {Array}
   */
  avatars: [],
  /**
   * @type {Array}
   */
  fileIndexs: [],
  /**
   * @type {Array}
   */
  urls: [],
  /**
   * @type {Array}
   */
  messages: [],
})
