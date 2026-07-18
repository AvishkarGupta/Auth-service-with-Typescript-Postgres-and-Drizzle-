import JWT from 'jsonwebtoken'

export interface UserTokenPayload{
  id: string
}

export function cretateUserToken(payload: UserTokenPayload){
  const token = JWT.sign(payload, process.env.USERTOKENSECRET!)

  return token
}

export function VerifyUserToken(token: string){
  try {
    const payload = JWT.verify(token, process.env.USERTOKENSECRET!) as UserTokenPayload
    return payload
  } catch (error) {
    return null
  }
}
