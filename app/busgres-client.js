const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresClient {
  constructor(sbConnectionString, sbConfig, pgClient) {
    this.sbClient = new ServiceBusClient(sbConnectionString)
    this.sbConfig = sbConfig
    this.receiver = sbClient.createReceiver(sbConfig)
    this.pgClient = new Client(pgClient)
  }

  async init() {
    await this.pgClient.connect()
  }

  async receiveMessage() {
    receiver.subscribe({
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
