export default async function saveMessage(client, tableName, columnNames, message) {
  try {
    const messageContent = message.body
    const columns = columnNames.map((_, index) => `$${index + 1}`).join(', ')
    const query = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columns})`
    const values = columnNames.map((column) => messageContent[column])

    await client.query(query, values)
  } catch (error) {
    console.error('Error saving message to database', { cause: error })
  }
}