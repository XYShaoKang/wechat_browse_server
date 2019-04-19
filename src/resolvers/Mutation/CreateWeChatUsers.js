import { arg, mutationField } from 'nexus'

import { downloadManage, asyncMap, groupsOf } from '../../utils'
import { map } from 'rxjs/operators'

/**
 * @param {string} key
 * @param {any} parent
 * @returns {import('rxjs').Observable<string> | undefined}
 */
export const asyncFn = (key, parent) => {
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
    // console.log('ok')
    return {
      id: currentWeChat.id,
    }
  },
})
