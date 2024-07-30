const { ServiceBusClient } = require('@azure/service-bus')

async function receiveMessage (tableName, columnNames) {
  this.sbClient = new ServiceBusClient(this.sbConnectionString)
  this.receiver = this.sbClient.createReceiver(this.sbEntityName)

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

module.exports = receiveMessage
