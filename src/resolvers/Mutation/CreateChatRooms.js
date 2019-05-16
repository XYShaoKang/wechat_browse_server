import { arg, mutationField } from 'nexus'

import { pickUserName, createChatRoomCreateInput } from '../../utils'

export const CreateChatRooms = mutationField('CreateChatRooms', {
  type: 'WeChat',
  args: {
    data: arg({ type: 'ChatRoomCreateInput', list: true, required: true }),
  },
  resolve: async (_, { data }, context) => {
    const { prisma, currentWeChat } = context
    if (!currentWeChat) {
      throw new Error('No WeChat')
    }

    const weChatUsers = await prisma.weChatUsers({
      where: { username_in: pickUserName(data) },
    })

    await prisma.updateWeChat({
      data: {
        chatRooms: {
          create: createChatRoomCreateInput(weChatUsers)(data),
        },
      },
      where: { id: currentWeChat.id },
    })

    return {
      id: currentWeChat.id,
    }
  },
})
