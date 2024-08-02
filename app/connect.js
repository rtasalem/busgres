const { ServiceBusClient } = require('@azure/service-bus')

const connect = async (pgClient, sbClient, sbConnectionString, sbEntityType, sbEntitySubscription, sbEntityName) => {
  try {
    await pgClient.connect()
    const sbClient = new ServiceBusClient(sbConnectionString)

    if (sbEntityType === 'queue') {
      return sbClient.createReceiver(sbEntityName)
    } else if (sbEntityType === 'topic' && sbEntitySubscription) {
      return sbClient.createReceiver(sbEntityName, sbEntitySubscription)
    } else {
      throw new Error('Invalid entity type (must be "queue" or "topic" OR missing subscription name for topic)')
    }
  } catch (error) {
    throw new Error('Error connecting to the database or Service Bus:', error)
  }
}

module.exports = connect
