export const weChatUserData = {
  weChatUsers: [
    {
      username: 'aaaa',
      alias: 'bbbb',
      conRemark: 'cccc',
      nickname: 'dddd',
      avatar: {
        bigImg: 'http://a.com/b',
        thumbnailImg: 'http://b.com/a',
      },
    },
  ],
}

export const chatRoomData = {
  chatRooms: [
    {
      username: 'aaaa@chatroom',
      nickname: 'bbbb',
      displayName: 'cccc',
      owner: 'a',
      memberList: ['a', 'b'],
      modifyTime: new Date('2019-04-24T16:51:14.743Z'),
      avatar: {
        bigImg: 'http://a.com/b',
        thumbnailImg: 'http://b.com/a',
      },
    },
  ],
}

export const messageData = {
  messages: [
    {
      msgSvrId: '1000000000000000001',
      isSend: 0,
      type: 1,
      talker: 'a',
      createTime: new Date('2016-05-19T00:00:22.935Z'),
    },
    {
      msgSvrId: '1000000000000000002',
      isSend: 1,
      type: 1,
      talker: 'b',
      createTime: new Date('2016-05-19T00:00:22.935Z'),
      chatRoom: 'b@chatroom',
    },
    {
      msgSvrId: '1000000000000000003',
      isSend: 0,
      type: 1,
      talker: 'b@chatroom',
      createTime: new Date('2016-07-10T11:40:28.809Z'),
      chatRoom: 'b@chatroom',
    },
  ],
}
