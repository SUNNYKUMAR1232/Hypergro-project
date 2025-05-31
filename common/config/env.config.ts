import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

function loadEnvironmentVariables() {
  const env = process.env.NODE_ENV || ''
  const envPath = path.join(process.cwd(), `.env${env}`)

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    console.log(`Environment: ${env}`)
    console.log(`Loading environment variables from: ${envPath}`)
  } else {
    console.error(`Environment file not found: ${envPath}`)
    process.exit(1) // Exit the process with an error code
  }
}

export default loadEnvironmentVariables
