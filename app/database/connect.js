import { Client } from 'pg'

export default async function establishDbConnection (config) {
  const client = new Client(config)

  try {
    await client.connect()
  } catch (error) {
    console.error('Error connecting to database:', { cause: error })
  }
}
