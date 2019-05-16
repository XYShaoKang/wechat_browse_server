import * as R from 'ramda'

const objOfCreate = R.objOf('create')
const objOfCreateUrl = R.pipe(
  R.objOf('url'),
  objOfCreate,
)
const createWeChatUserCreateInput = R.map(
  R.converge(R.assocPath(['avatar']), [
    R.pipe(
      R.prop('avatar'),
      R.when(
        R.is(Object),
        R.pipe(
          R.map(objOfCreateUrl),
          objOfCreate,
        ),
      ),
    ),
    R.identity,
  ]),
)

const pickUserName = R.reduce(
  R.useWith(R.concat, [
    R.identity,
    R.converge(R.concat, [
      R.propOr([], 'memberList'),
      R.pipe(
        R.prop('owner'),
        R.ifElse(R.is(String), R.of, R.always([])),
      ),
    ]),
  ]),
  [],
)

/**
 * @param {import("../../generated/prisma-client").WeChatUser[]} weChatUsers
 */
const createChatRoomCreateInput = weChatUsers => {
  const objOfCreate = R.objOf('create')
  const objOfConnect = R.objOf('connect')
  const objOfCreateUrl = R.pipe(
    R.objOf('url'),
    objOfCreate,
  )
  const notEmpty = R.pipe(
    R.either(R.isNil, R.isEmpty),
    R.not,
  )
  const ifElseFlaseToNull = R.curry((condition, onTrue) =>
    R.ifElse(condition, onTrue, R.always(null)),
  )
  const emptyToNull = ifElseFlaseToNull(notEmpty)
  const convertAvatar = R.converge(R.assocPath(['avatar']), [
    R.pipe(
      R.prop('avatar'),
      emptyToNull(
        R.pipe(
          R.map(objOfCreateUrl),
          objOfCreate,
        ),
      ),
    ),
    R.identity,
  ])
  /**
   * @param {string} uname
   */
  const mapUserNameToId = uname => {
    const user = weChatUsers.find(({ username }) => username === uname)
    if (user) {
      return user.id
    }
    return null
  }

  const objOfConnectUserId = R.pipe(
    mapUserNameToId,
    emptyToNull(R.pipe(R.objOf('id'))),
  )

  const convertOwner = R.converge(R.assocPath(['owner']), [
    R.pipe(
      R.prop('owner'),
      objOfConnectUserId,
      emptyToNull(objOfConnect),
    ),
    R.identity,
  ])

  const covertMemberList = R.converge(R.assocPath(['memberList']), [
    R.pipe(
      R.prop('memberList'),
      emptyToNull(
        R.pipe(
          R.map(objOfConnectUserId),
          emptyToNull(objOfConnect),
        ),
      ),
    ),
    R.identity,
  ])

  const convertUserName = R.pipe(
    convertOwner,
    covertMemberList,
  )
  return R.map(
    R.pipe(
      convertAvatar,
      convertUserName,
    ),
  )
}

const createMessageInput = R.map(
  R.pipe(
    R.converge(R.assocPath(['talker']), [
      R.pipe(
        R.prop('talker'),
        R.ifElse(
          R.both(R.is(String), R.complement(R.test(/@chatroom$/))),
          R.pipe(
            R.objOf('username'),
            R.objOf('connect'),
          ),
          R.always(null),
        ),
      ),
      R.identity,
    ]),
    R.converge(R.assocPath(['chatRoom']), [
      R.pipe(
        R.propOr(null, 'chatRoom'),
        R.when(
          R.is(String),
          R.pipe(
            R.objOf('username'),
            R.objOf('connect'),
          ),
        ),
      ),
      R.identity,
    ]),
  ),
)
export {
  createWeChatUserCreateInput,
  pickUserName,
  createChatRoomCreateInput,
  createMessageInput,
}
