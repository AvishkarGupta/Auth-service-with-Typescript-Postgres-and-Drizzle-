import express from 'express';
import type { Express } from 'express';
import { authRouter } from './auth/routes';
import { authenticationMiddelware } from './auth/middleware/auth-middleware';

export function CreateApplication (): Express{

  const app = express()

  // middlewares
  app.use(express.json())
  app.use(authenticationMiddelware())

  // routes
  
  app.get('/', (req, res) =>{
    console.log(`request received`)
    return res.json({message: `Say hello`})
  })
  
  app.use('/auth', authRouter)

  return app;
}