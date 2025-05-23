import { ServiceBusHandler } from './service-bus-handler.js'
import { PostgresHandler } from './postgres-handler.js'
import { MessagePersister } from './message-persister.js'

export class BusgresClient {
  constructor({serviceBus, postgres}) {
    const { connectionString, entity, entityType, subscription } = serviceBus

    this.serviceBusHandler = new ServiceBusHandler(
      connectionString,
      entity,
      entityType,
      subscription
    )

    this.postgresHandler = new PostgresHandler(postgres)
    this.messagePersister = new MessagePersister(this.postgresHandler)
    this.receiver = null
  }

  async start(table, columnNames) {
    try {
      await this.postgresHandler.connect()
      this.receiver = this.serviceBusHandler.getReceiver()

      this.receiver.subscribe({
        processMessage: async (message) => {
          await this.messagePersister.save(table, columnNames, message.body)
          await this.receiver.completeMessage(message)
        },
        processError: async (error) => {
          console.error(`Error receiving message from Service Bus: ${error}`)
        }
      })
    } catch (error) {
      throw new Error(`Error starting Busgres connection: ${error}`)
    }
  }

  async stop() {
    try {
      await this.postgresHandler.disconnect()
      await this.serviceBusHandler.disconnect()
    } catch (error) {
      throw new Error(`Error stopping Busgres connection: ${error}`)
    }
  }
}