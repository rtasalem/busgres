const { BusgresClient } = require('../app')

const pgClient = {
  host: 'insert-host-here',
  user: 'insert-username-here',
  password: 'insert-password-here',
  database: 'insert-database-name-here',
  port: 'insert-port-here'
}

const sbClient = {
  connectionString: 'insert-connection-string-here'
}

const sbEntity = 'insert-entity-name-here' // queue or topic

const bgClient = new BusgresClient(pgClient, sbClient, sbEntity)
