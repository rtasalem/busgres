const { saveMessage } = require('./save-message')

const receiveMessage = async (receiver, tableName, columnNames) => {
  receiver.subscribe({
    processMessage: async (message) => {
      console.log('The following message was received from Service Bus:', message.body)
      await saveMessage(tableName, columnNames, message)
      await receiver.completeMessage(message)
    },
    processError: async (error) => {
      console.error('Error occurred while receiving message from Service Bus:', error)
    }
  })
}

module.exports = receiveMessage
