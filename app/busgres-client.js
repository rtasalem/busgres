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
        await receiver.completeMessage(message)
      },
      processError: async (error) => {
        console.error(
          'Error occurred while receiving from Service Bus: ',
          error
        )
      }
    })
  }

  async saveMessageToDatabase(message) {
    try {
      const query = 'INSERT INTO messages (content) VALUES ($1)'
      const values = [message.body]
      await this.pgClient.query(query, values)
      console.log(
        'The following message has been saved to the database: ',
        message.body
      )
    } catch (error) {
      console.error('Error saving message to the database:', error)
    }
  }

  async close() {
    await this.pgClient.end()
    await this.sbClient.close()
  }
}

module.exports = {
  BusgresClient
}
