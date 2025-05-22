import { ServiceBusClient } from '@azure/service-bus'

export class ServiceBusClient {
  constructor(connectionString, entity, entityType, subscription, client) {
    this.connectionString = connectionString
    this.entity = entity
    this.entityType = entityType
    this.subscription = subscription
    this.client = new ServiceBusClient(connectionString)
  }

  createReceiver() {
    if (this.type === 'queue') {
      this.receiver = this.client.createReceiver(this.entity)
    } else if (this.type === 'topic' && this.subscription) {
      this.receiver = this.client.createReceiver(
        this.entity,
        this.subscription
      )
    } else {
      throw new Error(
        'Invalid entity type. Must be "queue" or "topic" OR subscription is missing'
      )
    }
  }

  async receiveMessage(table, columns) {
    this.createReceiver()

    this.receiver.subscribe({
      processMessage: async (message) => {
        await processMessageFn(message)
        await this.receiver.completeMessage(message)
      },
      processError: async (error) => {
        await processErrorFn(error)
      }
    })
  }
}