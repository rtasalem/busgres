import pg from 'pg'
const { Client } = pg

export class PostgresHandler {
  constructor (config) {
    this.client = new Client(config)
  }

  async connect () {
    try {
      await this.client.connect()
    } catch (error) {
      console.error(`Error connecting to Postgres: ${error.message}`)
    }
  }

  async disconnect () {
    try {
      await this.client.end()
    } catch (error) {
      console.error(`Error disconnecting from Postgres: ${error.message}`)
    }
  }

  async query (query, values) {
    return this.client.query(query, values)
  }
}
