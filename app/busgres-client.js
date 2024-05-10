const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresClient {
  constructor(sbConnectionString, sbEntity, pgClient) {
    this.sbConnectionString = sbConnectionString
    this.sbEntity = sbEntity
    this.pgClient = new Client(pgClient)
  }

  async connect() {
    await this.pgClient.connect()
  }

  async saveMessage(tableName, columnNames, message) {
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

  async receiveMessage(tableName, columnNames) {
    this.sbClient = new ServiceBusClient(this.sbConnectionString)
    this.receiver = this.sbClient.createReceiver(this.sbEntity)

    this.receiver.subscribe({
      processMessage: async (message) => {
        console.log(
          'The following message was received from Service Bus:',
          message.body
        )
        await this.saveMessage(tableName, columnNames, message)
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

  async disconnect() {
    await this.pgClient.end()
    await this.receiver.close()
    await this.sbClient.close()
  }
}

module.exports = {
  BusgresClient
}
