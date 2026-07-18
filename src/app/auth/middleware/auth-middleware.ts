import type {Request, Response, NextFunction} from 'express'
import { VerifyUserToken } from '../utils/token'

export function authenticationMiddelware (){
  return function(req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization']
    if(!header){
      return next()
    }

    if (!header?.startsWith('Bearer')){
      return res.status(400).json({message: `authorization header must starts with token`})
    }

    const token = header.split(' ')[1]

    if(!token) {
      return res.status(400).json({message: `Bearer must have a token`})
    }

    const user = VerifyUserToken(token)

    //@ts-ignore
    req.user = user
    next()
  }
}

export function restrictToAuthenticatedUser(){
  return function(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    if(!req.user) return res.status(401).json({message: `UnauthenticatedUser`})
      
    return next()
  }
}

