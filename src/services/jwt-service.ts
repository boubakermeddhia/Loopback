import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBinding} from '../keys'

const jwt = require('jsonwebtoken')
const signAsync = promisify(jwt.sign)
const verifytoken = promisify(jwt.verify)

export class JwtService {
  @inject(TokenServiceBinding.Token_secret)
  public readonly jwtsecret: string
  @inject(TokenServiceBinding.token_expires_in)
  public readonly jwtexpiresin: string
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Eroor while generating token')
    }
    let token = ''
    try {
      token = await signAsync(userProfile, this.jwtsecret, {expiresIn: this.jwtexpiresin})
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error when generating token ${err}`)
    }
    return token
  }
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('error token')
    }
    let userProfile: UserProfile
    try {
      const decryptedToken = await verifytoken(token, this.jwtsecret)
      userProfile = Object.assign(
        {id: "", name: ""},
        {id: decryptedToken.id, name: decryptedToken.name}
      )
    } catch (error) {
      throw new HttpErrors.Unauthorized(error.message)
    }
    return userProfile
  }
}
