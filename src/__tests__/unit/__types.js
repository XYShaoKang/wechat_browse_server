export const LOGIN = /* GraphQL */ `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        password
      }
    }
  }
`

export const SIGNUP = /* GraphQL */ `
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        password
      }
    }
  }
`

export const USERS = /* GraphQL */ `
  query users {
    users {
      id
      name
      email
      password
    }
  }
`

export const CreateWeChatUsers = /* GraphQL */ `
  mutation CreateWeChatUsers($weChatUsers: [WeChatUserCreateInput!]!) {
    CreateWeChatUsers(data: $weChatUsers) {
      id
    }
  }
`
export const CreateChatRooms = /* GraphQL */ `
  mutation CreateChatRooms($chatRooms: [ChatRoomCreateInput!]!) {
    CreateChatRooms(data: $chatRooms) {
      id
    }
  }
`
