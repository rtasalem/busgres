import { Client } from 'pg'

export class PostgresClient {
  constructor(config) {
    this.client = new Client(config)
  }

  async connect() {
    try {
      await this.client.connect()
    } catch (error) {
      console.error('Error connecting to Postgres database:', error)
    }
  }

  async persistMessage(table, columns, message) {
    try {
      const messageContent = message.body

      const columns = columnNames
        .map((column, index) => `$${index + 1}`)
        .join(', ')

      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns})`

      const values = columns.map((column) => messageContent[column])

      await this.client.query(query, values)

      console.log('A new message has been saved to the database:', messageContent)
    } catch (error) {
      console.error('Error saving message to the database:', error)
    }
  }

  async disconnect() {
    try {
      await this.client.end()
    } catch (error) {
      console.error('Error disconnecting database:', error)
    }
  }
}