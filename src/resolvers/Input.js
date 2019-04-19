import { inputObjectType } from 'nexus'

export const AvatarCreateInput = inputObjectType({
  name: 'AvatarCreateInput',
  definition(t) {
    t.string('thumbnailImg', { required: true })
    t.string('bigImg', { required: true })
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
