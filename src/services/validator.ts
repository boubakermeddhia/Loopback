import {HttpErrors} from '@loopback/rest'
import * as isEmail from 'isemail'
import {Credentials} from '../repositories/user.repository'

export function Validate(cred: Credentials) {
  if (!isEmail.validate(cred.email)) {
    throw new HttpErrors.UnprocessableEntity('email is invalid')
  }
  if (cred.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password is weak')
  }
}
