import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-koa'
import { defaultFieldResolver } from 'graphql'

class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function(...args) {
      const [, , ctx] = args
      if (ctx.currentUser) {
        const result = await resolve.apply(this, args)
        return result
      } else {
        throw new AuthenticationError(`Unauthenticated!`)
      }
    }
  }
}

export default RequireAuthDirective
