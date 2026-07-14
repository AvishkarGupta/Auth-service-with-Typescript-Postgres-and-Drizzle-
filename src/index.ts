import {createServer} from 'node:http'
import { CreateApplication } from './app'


async function main(){
  try {
    const server = createServer(CreateApplication())
    const PORT = process.env.PORT || 8080

    server.listen(PORT, () => {
      console.log(`Server is listening to PORT ${PORT}`)
    } )
  } catch (error) {
    console.log(`something went wrong while starting sever`)
    throw error
  }
}

main();