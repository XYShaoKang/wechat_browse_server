import { scalarType } from 'nexus'

export const UploadScalar = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value
  },
  serialize() {
    throw new Error('‘Upload’ scalar serialization unsupported.')
  },
  parseLiteral() {
    throw new Error('‘Upload’ scalar literal unsupported.')
  },
})
