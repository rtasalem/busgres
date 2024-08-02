// const { ServiceBusClient } = require('@azure/service-bus')
// const { Client } = require('pg')

// class BusgresClient {
//   constructor (sbConnectionString, sbEntityName, sbEntityType, sbEntitySubscription, pgClient) {
//     sbConnectionString = sbConnectionString
//     sbEntityName = sbEntityName
//     sbEntityType = sbEntityType
//     sbEntitySubscription = sbEntitySubscription || null
//     pgClient = new Client(pgClient)
//   }

//   async connect () {
//     try {
//       await pgClient.connect()
//     } catch (error) {
//       console.error('Error connecting to the database:', error)
//     }
//   }

//   async saveMessage (tableName, columnNames, message) {
//     try {
//       const messageContent = message.body
//       const columns = columnNames
//         .map((column, index) => `$${index + 1}`)
//         .join(', ')
//       const query = `INSERT INTO ${tableName} (${columnNames.join(
//         ', '
//       )}) VALUES (${columns})`

//       const values = columnNames.map((column) => messageContent[column])

//       await pgClient.query(query, values)
//       console.log(
//         'The following message has been saved to the database:',
//         messageContent
//       )
//     } catch (error) {
//       console.error('Error saving message to the database:', error)
//     }
//   }

//   async receiveMessage (tableName, columnNames) {
//     sbClient = new ServiceBusClient(sbConnectionString)
//     receiver = sbClient.createReceiver(sbEntity)

//     if (sbEntityType === 'queue') {
//       receiver = sbClient.createReceiver(sbEntityName)
//     } else if (sbEntityType === 'topic' && sbEntitySubscription) {
//       receiver = sbClient.createReceiver(
//         sbEntityName,
//         sbEntitySubscription
//       )
//     } else {
//       throw new Error(
//         'Invalid entity type (must be "queue" or "topic" OR missing subscription name for topic'
//       )
//     }

//     receiver.subscribe({
//       processMessage: async (message) => {
//         console.log(
//           'The following message was received from Service Bus:',
//           message.body
//         )
//         await saveMessage(tableName, columnNames, message)
//         await receiver.completeMessage(message)
//       },
//       processError: async (error) => {
//         console.error(
//           'Error occurred while receiving message from Service Bus:',
//           error
//         )
//       }
//     })
//   }

//   async disconnect () {
//     try {
//       await pgClient.end()
//       await receiver.close()
//       await sbClient.close()
//     } catch (error) {
//       console.error('Error disconnecting:', error)
//     }
//   }
// }

// module.exports = {
//   BusgresClient
// }

const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

const BusgresClient = (sbConnectionString, sbEntityName, sbEntityType, sbEntitySubscription, pgConfig) => {
  const pgClient = new Client(pgConfig)
  let sbClient, receiver

  const connect = async () => {
    try {
      await pgClient.connect()
      sbClient = new ServiceBusClient(sbConnectionString)
      if (sbEntityType === 'queue') {
        receiver = sbClient.createReceiver(sbEntityName)
      } else if (sbEntityType === 'topic' && sbEntitySubscription) {
        receiver = sbClient.createReceiver(sbEntityName, sbEntitySubscription)
      } else {
        throw new Error('Invalid entity type (must be "queue" or "topic" OR missing subscription name for topic)')
      }
    } catch (error) {
      throw new Error('Error connecting to the database or Service Bus:', error)
    }
  }

  const saveMessage = async (tableName, columnNames, message) => {
    try {
      const messageContent = message.body
      const columns = columnNames.map((column, index) => `$${index + 1}`).join(', ')
      const query = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columns})`
      const values = columnNames.map((column) => messageContent[column])
      await pgClient.query(query, values)
      console.log('The following message has been saved to the database:', messageContent)
    } catch (error) {
      console.error('Error saving message to the database:', error)
    }
  }

  const receiveMessage = async (tableName, columnNames) => {
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

  const disconnect = async () => {
    try {
      await pgClient.end()
      if (receiver) await receiver.close()
      if (sbClient) await sbClient.close()
    } catch (error) {
      console.error('Error disconnecting the Busgres client:', error)
    }
  }

  return {
    connect,
    saveMessage,
    receiveMessage,
    disconnect,
    pgClient // Expose pgClient if needed directly
  }
}

module.exports = {
  BusgresClient
}
