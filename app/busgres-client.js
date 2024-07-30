const { Client } = require('pg')
const connect = require('./connect')
const saveMessage = require('./save-message')
const receiveMessage = require('./receive-message')
const disconnect = require('./disconnect')

class BusgresClient {
  constructor (sbConnectionString, sbEntityName, sbEntityType, sbEntitySubscription, pgClient) {
    this.sbConnectionString = sbConnectionString
    this.sbEntityName = sbEntityName
    this.sbEntityType = sbEntityType
    this.sbEntitySubscription = sbEntitySubscription || null
    this.pgClient = new Client(pgClient)
  }

  async connect () {
    return connect(this.pgClient)
  }

  async saveMessage (tableName, columnNames, message) {
    return saveMessage(this.pgClient, tableName, columnNames, message)
  }

  async receiveMessage (tableName, columnNames) {
    return receiveMessage(this.sbConnectionString, this.sbEntityName, this.sbEntityType, this.sbEntitySubscription, this.pgClient, tableName, columnNames)
  }

  async disconnect () {
    return disconnect(this.pgClient, this.receiver, this.sbClient)
  }
}

module.exports = {
  BusgresClient
}
