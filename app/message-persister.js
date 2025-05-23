export class MessagePersister {
  constructor (postgresHandler) {
    this.database = postgresHandler
  }

  async save (table, columnNames, message) {
    try {
      const columns = columnNames
        .map((column, index) => `$${index + 1}`)
        .join(', ')

      const query = `INSERT INTO ${table} (${columnNames.join(', ')}) VALUES (${columns})`
      const values = columnNames.map((column) => message[column])

      await this.database.query(query, values)
    } catch (error) {
      console.error(`Error persisting message to database: ${error.message}`)
    }
  }
}
