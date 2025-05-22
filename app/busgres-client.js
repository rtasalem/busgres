import { ServiceBusClient } from '@azure/service-bus'
import { Client } from 'pg'

export class BusgresClient {
  constructor (sbConnectionString, sbEntityName, sbEntityType, sbEntitySubscription, pgClient) {
    this.sbConnectionString = sbConnectionString
    this.sbEntityName = sbEntityName
    this.sbEntityType = sbEntityType
    this.sbEntitySubscription = sbEntitySubscription || null
    this.pgClient = new Client(pgClient)
  }

  async connect () {
    try {
      await this.pgClient.connect()
    } catch (error) {
      console.error('Error connecting to the database:', error)
    }
  }

  async saveMessage (tableName, columnNames, message) {
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

  async receiveMessage (tableName, columnNames) {
    this.sbClient = new ServiceBusClient(this.sbConnectionString)
    this.receiver = this.sbClient.createReceiver(this.sbEntity)

    if (this.sbEntityType === 'queue') {
      this.receiver = this.sbClient.createReceiver(this.sbEntityName)
    } else if (this.sbEntityType === 'topic' && this.sbEntitySubscription) {
      this.receiver = this.sbClient.createReceiver(
        this.sbEntityName,
        this.sbEntitySubscription
      )
    } else {
      throw new Error(
        'Invalid entity type (must be "queue" or "topic" OR missing subscription name for topic'
      )
    }

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

  async disconnect () {
    try {
      await this.pgClient.end()
      await this.receiver.close()
      await this.sbClient.close()
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }
}
