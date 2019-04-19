import gql from 'graphql-tag'

export const LOGIN = gql`
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

export const SIGNUP = gql`
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

export const USERS = gql`
  query users {
    users {
      id
      name
      email
      password
    }
  }
`

export const CreateWeChatUsers = gql`
  mutation CreateWeChatUsers($weChatUsers: [WeChatUserCreateInput!]!) {
    CreateWeChatUsers(data: $weChatUsers) {
      id
    }
  }
`
export const CreateChatRooms = gql`
  mutation CreateChatRooms($chatRooms: [ChatRoomCreateInput!]!) {
    CreateChatRooms(data: $chatRooms) {
      id
    }
  }
`
