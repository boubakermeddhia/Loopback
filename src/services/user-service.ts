import {UserService} from '@loopback/authentication'
import {Credentials, UserRepository} from '../repositories/user.repository';
import {User} from '../models/user.model'
import {UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {bcryptHash} from './hash.password';
import {PasswordHasherBinding} from '../keys'

export class userService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBinding.service_hasher)
    public hasher: bcryptHash

  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    })
    if (!foundUser) {
      throw new HttpErrors.NotFound(`user not found`)
    }
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('password is invalid')
    }
    return foundUser
  }
  convertToUserProfile(user: User): UserProfile {
    let userName = ''
    if (user.firstname) {
      userName = user.firstname
    }
    if (user.lastname) {
      userName = user.firstname ?
        `${user.firstname} ${user.lastname}` : user.lastname
    }
    return {id: user.id, name: userName}
  }

}
