async function saveMessage (tableName, columnNames, message) {
  try {
    const messageContent = message.body
    const columns = columnNames
      .map((column, index) => `$${index + 1}`)
      .join(', ')
    const query = `INSERT INTO ${tableName} (${columnNames.join(
      ', '
    )}) VALUES (${columns})`

    const values = columnNames.map((column) => messageContent[column])

    await this.pgClient.query(query, values)
    console.log(
      'The following message has been saved to the database:',
      messageContent
    )
  } catch (error) {
    console.error('Error saving message to the database:', error)
  }
}

module.exports = saveMessage
