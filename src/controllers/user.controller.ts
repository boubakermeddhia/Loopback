import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getJsonSchema, post, requestBody} from '@loopback/rest';
import * as _ from 'lodash';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from '../repositories/user.repository';
import {bcryptHash} from '../services/hash.password';
import {JwtService} from '../services/jwt-service';
import {userService} from '../services/user-service';
import {Validate} from '../services/validator';
import {CredentialsRequestBody} from './specs/user.controller.spec';
import {UserProfile} from '@loopback/security';
import {get} from '@loopback/rest';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {PasswordHasherBinding, TokenServiceBinding} from '../keys'

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBinding.service_hasher)
    public hasher: bcryptHash,
    @inject(PasswordHasherBinding.user_service)
    public UserService: userService,
    @inject(TokenServiceBinding.token_service)
    public jwtService: JwtService
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchema(User)
        },
      },
    },
  },
  )
  async signup(@requestBody() userData: User) {
    Validate(_.pick(userData, ['email', 'password']))
    userData.password = await this.hasher.hashpassword(userData.password)
    const savedUser = await this.userRepository.create(userData)
    return savedUser
  }
  @post('/signin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: "object",
              properties: {
                token: {
                  type: 'string'
                },
              },
            },
          },
        },
      },
    },
  },
  )
  async login(@requestBody({CredentialsRequestBody}) cred: Credentials): Promise<{token: String}> {
    const user = await this.UserService.verifyCredentials(cred)
    const userProfile = this.UserService.convertToUserProfile(user)
    const token = await this.jwtService.generateToken(userProfile)
    return Promise.resolve({token})
  }
  @get('/secureRoute')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    CurrentUser: UserProfile
  ): Promise<UserProfile> {
    return Promise.resolve(CurrentUser)
  }
}
