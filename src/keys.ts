import {BindingKey} from '@loopback/core'
import {TokenService, UserService} from '@loopback/authentication'
import {passwordHasher} from './services/hash.password'
import {Credentials} from './repositories'
import {User} from './models'

export namespace Tokenservice {
  export const TokenSecretValue = "dhiabouabker"
  export const TokenExpiresIn = "7h"
}

export namespace TokenServiceBinding {
  export const Token_secret = BindingKey.create<String>(
    "auth.jwt.secret"
  )
  export const token_expires_in = BindingKey.create<String>(
    "auth.jwt.expireIn"
  )
  export const token_service = BindingKey.create<TokenService>(
    "service.jwt"
  )
}

export namespace PasswordHasherBinding {
  export const service_hasher = BindingKey.create<passwordHasher>(
    "service.hasher"
  )
  export const user_service = BindingKey.create<UserService<Credentials, User>>(
    "services.user.service"
  )
}

export namespace userserviceBinding {
  export const user_service = BindingKey.create<UserService<Credentials, User>>(
    "services.user.service"
  )
}
