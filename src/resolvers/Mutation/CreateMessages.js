import { arg, mutationField } from 'nexus'

import { createMessageInput } from '../../utils'

export const CreateMessages = mutationField('CreateMessages', {
  type: 'String',
  args: {
    data: arg({ type: 'MessagesCreateInput', list: true, required: true }),
  },
  resolve: async (_, { data }, context) => {
    const { prisma, currentWeChat } = context
    if (!currentWeChat) {
      throw new Error('No WeChat')
    }

    await prisma.updateWeChat({
      where: { id: currentWeChat.id },
      data: {
        messages: { create: createMessageInput(data) },
      },
    })
    return '123'
  },
})
