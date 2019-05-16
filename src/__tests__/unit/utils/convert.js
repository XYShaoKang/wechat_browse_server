import {
  createWeChatUserCreateInput,
  pickUserName,
  createChatRoomCreateInput,
  createMessageInput,
} from '../../../utils'

const userData = [
  {
    username: 'aaaa',
    alias: '',
    conRemark: '',
    nickname: 'AAAA',
    avatar: {
      thumbnailImg: 'http://a.com/0',
      bigImg: 'http://a.com/1',
    },
  },
  {
    username: 'bbbb',
    alias: '',
    conRemark: '',
    nickname: 'BBBB',
    avatar: {
      thumbnailImg: 'http://b.com/0',
      bigImg: 'http://b.com/1',
    },
  },
]
const chatRoomData = [
  {
    username: 'abc@chatroom',
    nickname: 'ABC',
    displayName: 'AAAA、BBBB、CCCC',
    owner: 'aaaa',
    memberList: ['aaaa', 'bbbb', 'cccc'],
    modifyTime: '2018-10-13T13:10:31.025Z',
    avatar: null,
  },
  {
    username: 'def@chatroom',
    nickname: 'DEF',
    displayName: 'DDDD、EEEE、FFFF',
    owner: 'dddd',
    memberList: ['dddd', 'eeee', 'ffff'],
    modifyTime: '2018-10-13T13:10:31.025Z',
    avatar: {
      thumbnailImg: 'http://def.com/0',
      bigImg: 'http://def.com/1',
    },
  },
]
const weChatUsers = [
  { username: 'aaaa', id: '0' },
  { username: 'bbbb', id: '1' },
  { username: 'cccc', id: '2' },
  { username: 'dddd', id: '3' },
  { username: 'eeee', id: '4' },
  { username: 'ffff', id: '5' },
]
const messageData = [
  {
    msgSvrId: '1000000000000000001',
    isSend: 0,
    type: 1,
    talker: 'aaaa',
    createTime: '2016-05-19T00:00:22.935Z',
  },
  {
    msgSvrId: '1000000000000000002',
    isSend: 1,
    type: 1,
    talker: 'bbbb',
    createTime: '2016-05-19T00:00:22.935Z',
    chatRoom: 'bbbb@chatroom',
  },
  {
    msgSvrId: '1000000000000000003',
    isSend: 0,
    type: 1,
    talker: 'bbbb@chatroom',
    createTime: '2016-07-10T11:40:28.809Z',
    chatRoom: 'bbbb@chatroom',
  },
]
describe('convert', () => {
  it('createWeChatUserCreateInput', () => {
    const chatUserCreateInput = createWeChatUserCreateInput(userData)

    expect(chatUserCreateInput).toMatchSnapshot()
  })
  it('pickUserName', () => {
    /** @type {string[]} */
    const usernames = pickUserName(chatRoomData)

    expect(usernames).toMatchSnapshot()
  })
  it('pickUserName', () => {
    const chatRoomCreateInput = createChatRoomCreateInput(weChatUsers)(
      chatRoomData,
    )

    expect(chatRoomCreateInput).toMatchSnapshot()
  })
  it('createMessageInput', () => {
    const messageInput = createMessageInput(messageData)

    expect(messageInput).toMatchSnapshot()
  })
})
