import express from 'express';
import type { Express } from 'express';

export function CreateApplication (): Express{

  const app = express()

  // middlewares


  // routes

  app.get('/', (req, res) =>{
    console.log(`request received`)
    return res.json({message: `Say hello`})
  })

  return app;
}