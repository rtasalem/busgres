async function connect () {
  try {
    await this.pgClient.connect()
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

module.exports = connect
