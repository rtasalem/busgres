import { ServiceBusClient } from '@azure/service-bus'

export class ServiceBusHandler {
  constructor(connectionString, entity, entityType, subscription) {
    this.client = new ServiceBusClient(connectionString)
    this.entity = entity
    this.entityType = entityType
    this.subscription = subscription
  }

  getReceiver() {
    if (this.entityType === 'queue') {
      return this.client.createReceiver(this.entity)
    } else if (this.entityType === 'topic') {
      if (!this.subscription) {
        throw new Error('Subscription is missing')
      }

      return this.client.createReceiver(this.entity, this.subscription)
    } else {
      throw new Error('Entity type must be "queue" or "topic"')
    }
  }

  async disconnect() {
    try {
      await this.client.close()
    } catch (error) {
      throw new Error(`Error closing Service Bus connection: ${error}`)
    }
  }
}