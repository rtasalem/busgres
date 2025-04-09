import { ServiceBusClient } from '@azure/service-bus'

export default async function createReceiver (connectionString, entityName, entityType, subscriptionName) {
  const client = new ServiceBusClient(connectionString)

  let receiver

  if (entityType === 'queue') {
    receiver = client.createReceiver(entityName)
  } else if (entityType === 'topic' && subscriptionName) {
    receiver = client.createReceiver(entityName, subscriptionName)
  } else {
    throw new Error('Invalid entity type (must be "queue" or "topic") OR subscriptionName is missing for topic')
  }

  return { client, receiver }
}
