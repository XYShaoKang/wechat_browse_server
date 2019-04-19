import { arg, mutationField } from 'nexus'

import { downloadManage, asyncMap, groupsOf } from '../../utils'
import { map } from 'rxjs/operators'
/**
 * @param {string} key
 * @param {any} parent
 * @returns {import('rxjs').Observable<string> | undefined}
 */
const asyncFn = (key, parent) => {
  const el = parent[key]
  if (key === 'avatar') {
    parent[key] = { create: el }
  } else if (key === 'thumbnailImg' || key === 'bigImg') {
    return downloadManage(el).pipe(
      map(id => {
        parent[key] = { connect: { id } }
        return id
      }),
    )
  }
}

export const CreateChatRooms = mutationField('CreateChatRooms', {
  type: 'ChatRoom',
  args: {
    data: arg({ type: 'ChatRoomCreateInput', list: true, required: true }),
  },
  resolve: async (_, { data }, { prisma, currentWeChat }) => {
    if (!currentWeChat) {
      throw new Error('No WeChat')
    }
    const maxLength = 1000
    const chatRooms = groupsOf(maxLength)(data)
    for (const chatRoomSection of chatRooms) {
      const chatRoomsInput = await asyncMap(asyncFn, chatRoomSection)
      await prisma.updateWeChat({
        data: {
          chatRooms: {
            create: [...chatRoomsInput],
          },
        },
        where: {
          id: currentWeChat.id,
        },
      })
    }

    return {
      id: currentWeChat.id,
    }
  },
})
