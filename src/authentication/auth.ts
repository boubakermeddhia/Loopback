import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request, RedirectRoute, HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBinding} from '../keys'
import {JwtService} from '../services/jwt-service'

export class jwtStrategy implements AuthenticationStrategy {
  constructor(
    @inject(TokenServiceBinding.token_service)
    public jwtservice: JwtService
  ) { }
  name: string = ""
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCred(request)
    const profile = await this.jwtservice.verifyToken(token)
    return Promise.resolve(profile)
  }
  extractCred(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('please login')
    }
    const authHeader = request.headers.authorization
    if (!authHeader.startsWith("bearer")) {
      throw new HttpErrors.Unauthorized('auth is not a bearer')
    }
    const token=authHeader.split(' ')[1]
    return token
  }
}
