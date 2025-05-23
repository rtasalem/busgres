export class MessagePersister {
  constructor(postgresHandler) {
    this.db = postgresHandler
  }

  async save(table, columnNames, message) {
    try {
      const columns = columnNames
        .map((column, index) => `$${index + 1}`)
        .join(', ')

      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns})`
      const values = columns.map((column) => message[column])
      await this.database.query(query, values)
    } catch (error) {
      throw new Error(`Error persisting message to database: ${error}`)
    }
  }
}