import { arg, mutationField } from 'nexus'

import { downloadManage, asyncMap, groupsOf } from '../../utils'
import { map } from 'rxjs/operators'
/**
 * @param {object} data
 * @returns {object}
 */
const asyncFn = data => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const el = data[key]
      if (key === 'avatar') {
        data[key] = { create: el }
      } else if (key === 'thumbnailImg' || key === 'bigImg') {
        data[key] = downloadManage(el).pipe(
          map(id => {
            data[key] = { connect: { id } }
            return id
          }),
        )
      } else if (key === 'memberList') {
        data[key] = {
          connect: el.map(
            /**
             * @param {string} username
             */
            username => ({ username }),
          ),
        }
      }
    }
  }
  return data
}

export const CreateChatRooms = mutationField('CreateChatRooms', {
  type: 'WeChat',
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
