export const credentialsSchema = {
  type: "object",
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 8
    }
  }
}

export const CredentialsRequestBody = {
  descritption: 'the inpus of login function',
  required: true,
  content: {
    'application/json': {schema: credentialsSchema}
  }
}
