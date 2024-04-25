const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresClient {
  constructor(sbClient, sbConfig, pgClient) {
    this.sbClient = new ServiceBusClient(sbClient)
    this.sbConfig = sbConfig
    this.receiver = null
    this.sender = null
    this.pgClient = new Client(pgClient)
  }

  async init() {
    await this.pgClient.connect()
  }

  async receiveMessages() {
    const receiver = this.sbClient.createReceiver(this.sbConfig)
    receiver.subscribe({
      processMessage: async (message) => {
        console.log(
          'The following message was received from Service Bus:',
          message.body
        )
        await receiver.completeMessage(message)
      },
      processError: async (error) => {
        console.error('Error occurred:', error)
      }
    })
  }

  async saveMessageToDatabase(message) {
    try {
      const query = 'INSERT INTO messages (content) VALUES ($1)'
      const values = [message.body]
      await this.pgClient.query(query, values)
      console.log('Message saved to the database')
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
