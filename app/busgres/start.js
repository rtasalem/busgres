import establishDbConnection from '../database/connect.js'
import saveMessage from '../database/save-message.js'
import createReceiver from '../messaging/receiver.js'

export default async function startBusgres (messageConfig, dbConfig, tableName, columnNames) {
  const dbClient = await establishDbConnection(dbConfig)
  const { messageClient, receiver } = await createReceiver(
    messageConfig.connectionString,
    messageConfig.entityName,
    messageConfig.entityType,
    messageConfig.subscriptionName
  )

  receiver.subscribe({
    processMessage: async (message) => {
      await saveMessage(tableName, columnNames, message)
      await receiver.completeMessage(message)
    },
    processError: async (error) => {
      console.error('Error occurred while receiving message from Service Bus:', { cause: error })
    }
  })

  return { dbClient, messageClient, receiver }
}
