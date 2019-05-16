import { arg, mutationField } from 'nexus'

import { createWeChatUserCreateInput } from '../../utils'

export const CreateWeChatUsers = mutationField('CreateWeChatUsers', {
  type: 'WeChat',
  args: {
    data: arg({ type: 'WeChatUserCreateInput', list: true, required: true }),
  },
  resolve: async (_, { data }, context) => {
    const { prisma, currentWeChat } = context
    if (!currentWeChat) {
      throw new Error('No WeChat')
    }

    await prisma.updateWeChat({
      data: {
        weChatUsers: {
          create: createWeChatUserCreateInput(data),
        },
      },
      where: { id: currentWeChat.id },
    })

    return {
      id: currentWeChat.id,
    }
  },
})
