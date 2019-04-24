import { arg, mutationField } from 'nexus'

import { downloadManage, asyncMap, groupsOf } from '../../utils'
import { map } from 'rxjs/operators'

/**
 * @param {object} data
 * @returns {object}
 */
export const asyncFn = data => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]
      if (key === 'avatar') {
        data[key] = { create: element }
      } else if (key === 'thumbnailImg' || key === 'bigImg') {
        data[key] = downloadManage(element).pipe(
          map(id => {
            data[key] = { connect: { id } }
            return id
          }),
        )
      }
    }
  }

  return data
}

export const CreateWeChatUsers = mutationField('CreateWeChatUsers', {
  type: 'WeChat',
  args: {
    data: arg({ type: 'WeChatUserCreateInput', list: true, required: true }),
  },
  resolve: async (_, { data }, { prisma, currentWeChat }) => {
    if (!currentWeChat) {
      throw new Error('No WeChat')
    }
    const maxLength = 1000
    const users = groupsOf(maxLength)(data)
    for (const userSection of users) {
      const weChatUsersInput = await asyncMap(asyncFn, userSection)

      await prisma.updateWeChat({
        data: {
          weChatUsers: {
            create: [...weChatUsersInput],
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
