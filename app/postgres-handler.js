import { Client } from 'pg'

export class PostgresHandler {
  constructor(config) {
    this.client = new Client(config)
  }

  async connect () {
    try {
      await this.client.connect()
    } catch (error) {
      throw new Error(`Error connecting to Postgres: ${error}`)
    }
  }

  async disconnect () {
    try {
      await this.client.end()
    } catch (error) {
      throw new Error(`Error disconnecting from Postgres: ${error}`)
    }
  }

  async query(query, values) {
    return this.client.query(query, values)
  }
}