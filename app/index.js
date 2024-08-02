const { Client } = require('pg')
const connect = require('./connect')
const disconnect = require('./disconnect')
const receiveMessage = require('./receive-message')

const BusgresClient = async (sbConnectionString, sbEntityName, sbEntityType, sbEntitySubscription, pgConfig) => {
  const pgClient = new Client(pgConfig)
  let sbClient, receiver

  await connect(pgClient)
  await receiveMessage()
  await disconnect(pgClient, receiver, sbClient)

  return {
    connect,
    receiveMessage,
    disconnect,
    pgClient
  }
}

module.exports = BusgresClient
