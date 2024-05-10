const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresClient {
  constructor(sbConnectionString, sbConfig, pgClient) {
    this.sbConnectionString = sbConnectionString
    this.sbConfig = sbConfig
    this.pgClient = new Client(pgClient)
  }

  async connect() {
    await this.pgClient.connect()
  }

  async receiveMessage() {
    this.sbClient = new ServiceBusClient(this.sbConnectionString)
    this.receiver = this.sbClient.createReceiver(this.sbConfig)

    this.receiver.subscribe({
      processMessage: async (message) => {
        console.log(
          'The following message was received from Service Bus:',
          message.body
        )
        await this.receiver.completeMessage(message)
      },
      processError: async (error) => {
        console.error(
          'Error occurred while receiving message from Service Bus:',
          error
        )
      }
    })
  }

  async saveMessageToDatabase(tableName, columnName, message) {
    try {
      // const query = 'INSERT INTO messages (content) VALUES ($1)'
      // const values = [message]
      const columns = columnNames
        .map((column, index) => `$${index + 1}`)
        .join(', ')
      const query = `INSERT INTO ${tableName} (${columnNames.join(
        ', '
      )}) VALUES (${columns})`

      const values = columnNames.map((column) => message[column])

      await this.pgClient.query(query, values)
      console.log(
        'The following message has been saved to the database:',
        message
      )
    } catch (error) {
      console.error('Error saving message to the database:', error)
    }
  }

  async disconnect() {
    await this.pgClient.end()
    await this.receiver.close()
    await this.sbClient.close()
  }
}

module.exports = {
  BusgresClient
}
