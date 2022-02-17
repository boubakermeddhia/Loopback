import {genSalt, hash, compare} from 'bcryptjs'

export interface passwordHasher<T = string> {
  hashpassword(password: T): Promise<T>,
  comparePassword(providedPassword: T, userPassword: T): Promise<boolean>
}

export class bcryptHash implements passwordHasher<string>{
  async hashpassword(password: string) {
    const salt = await genSalt(12)
    return await hash(password, salt)
  }
  async comparePassword(providedPassword: string, userPassword: string): Promise<boolean> {
    const passwordMatched = await compare(providedPassword, userPassword)
    return passwordMatched
  }
}
