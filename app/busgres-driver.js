const { ServiceBusClient } = require('@azure/service-bus')
const { Client } = require('pg')

class BusgresDriver {
  constructor(
    serviceBusConnectionString,
    postgresConfig,
    entityName,
    isTopic = false
  ) {
    this.serviceBusClient = new ServiceBusClient(serviceBusConnectionString)
    this.postgresClient = new Client(postgresConfig)
    this.entityName = entityName
    this.isTopic = isTopic
  }
}

module.exports = BusgresDriver
