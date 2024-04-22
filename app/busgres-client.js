const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresClient {
  constructor(sbClient, pgClient, sbEntity) {
    this.sbClient = new ServiceBusClient(sbClient)
    this.pgClient = new Client(pgClient)
    this.sbEntity = sbEntity
    this.sender = null
    this.receiver = null
  }

  async init() {
    await this.pgClient.connect()
    this.sender = this.sbClient.createSender(this.sbEntity)
    this.receiver = this.sbClient.createReceiver(this.sbEntity)
  }
}

module.exports = {
  BusgresClient
}
