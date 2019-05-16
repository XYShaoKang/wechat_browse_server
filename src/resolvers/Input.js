import { inputObjectType } from 'nexus'

export const AvatarCreateInput = inputObjectType({
  name: 'AvatarCreateInput',
  definition(t) {
    t.string('thumbnailImg')
    t.string('bigImg')
  },
})

export const WeChatUserCreateInput = inputObjectType({
  name: 'WeChatUserCreateInput',
  definition(t) {
    t.string('username', { required: true })
    t.string('alias', { required: true })
    t.string('conRemark', { required: true })
    t.string('nickname', { required: true })
    t.field('avatar', { type: 'AvatarCreateInput' })
  },
})

export const ChatRoomCreateInput = inputObjectType({
  name: 'ChatRoomCreateInput',
  definition(t) {
    t.string('username', { required: true })
    t.string('nickname', { required: true })
    t.string('displayName', { required: true })
    t.string('owner', { required: true })
    t.list.string('memberList', { required: true })
    t.field('modifyTime', { type: 'DateTime', required: true })
    t.field('avatar', { type: 'AvatarCreateInput' })
  },
})

export const MessagesCreateInput = inputObjectType({
  name: 'MessagesCreateInput',
  definition(t) {
    t.string('msgSvrId')
    t.int('isSend', { required: true })
    t.int('type', { required: true })
    t.string('talker', { required: true })
    t.field('createTime', { type: 'DateTime', required: true })
    t.string('chatRoom')
  },
})
