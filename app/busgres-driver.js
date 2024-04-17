const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresDriver {
  constructor(sbConfig, pgConfig, entityName) {
    this.sbConfig = new ServiceBusClient(sbConfig)
    this.pgConfig = new Client(pgConfig)
    this.entityName = entityName
  }

  async init() {
    await this.pgConfig.connect()
    this.sbReceiver = this.sbConfig.createReceiver(this.entityName)
  }
}
