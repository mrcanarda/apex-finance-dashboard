import { connectDb } from './config/db'
import { env } from './config/env'
import { createApp } from './app'

async function main() {
  await connectDb()
  const app = createApp()
  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
