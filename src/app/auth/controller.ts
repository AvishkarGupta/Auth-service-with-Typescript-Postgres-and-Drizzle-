import type {Request, Response} from 'express'
import { signinPayloadModel, signupPayloadModel } from './models'
import {db} from '../../db'
import { usersTable } from '../../db/schema'
import { eq } from 'drizzle-orm'
import {randomBytes, createHmac} from 'node:crypto'
import { email } from 'zod'
import { cretateUserToken, UserTokenPayload } from './utils/token'

class AuthenticationController {

  public async handleSignup(req: Request, res: Response){

    const validatedResult = await signupPayloadModel.safeParseAsync(req.body)

    if(validatedResult.error) return res.status(400).json({message:`Payload doesn't statisfy the requirments`, error: validatedResult.error.issues})
    
    const { firstName, lastName, email, password} = validatedResult.data

    const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

    if(userEmailResult.length > 0) return res.status(401).json({message: `User with this email already exist.`})

    const salt = randomBytes(32).toString('hex')

    const hash = createHmac('sha256', salt).update(password).digest('hex')

    const [result] = await db.insert(usersTable).values({
      email,
      password: hash,
      salt,
      firstName,
      lastName
    }).returning({id: usersTable.id})

    return res.status(201).json({message: `User created sucessfully`, id: result?.id})
      
  }

  public async handleSigin(req: Request, res: Response){

    const validatedResult = await signinPayloadModel.safeParseAsync(req.body);

    if(validatedResult?.error) return res.status(400).json({message:`Payload doesn't statisfy the requirments`, error: validatedResult.error.issues})

    const {email, password} = validatedResult.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable?.email, email));

    if(!user) return res.status(400).json({message: `Incorrect email or password`})

    // const salt = randomBytes(32).toString('hex')

    const hash = createHmac('sha256', user?.salt!).update(password).digest('hex')

    if(user.password != hash) return res.status(400).json({message: `Incorrect email or password`})

    const token = cretateUserToken({id: user.id})

    return res.status(200).json({message: `User logged in sucessfully`, data: user, token})
 
  }

  public async handleMe(req: Request, res: Response){

    //@ts-ignore
    const {id} = req.user! as UserTokenPayload
    
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id))

    return res.status(200).json({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email
    })

  }

}

export default AuthenticationController