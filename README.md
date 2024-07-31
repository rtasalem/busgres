# Busgres

[Busgres](https://www.npmjs.com/package/busgres) is a Node.js package that will receieve a message from an Azure Service Bus queue or topic and save it into a PostgreSQL database. It utilises the [`@azure/service-bus`](https://www.npmjs.com/package/@azure/service-bus) package for Service Bus integration and the [`pg` (node-postgres)](https://www.npmjs.com/package/pg) package for PostgreSQL connectivity.

## Installation

This package can be installed using NPM:

```
npm i busgres
```

## Usage

`BusgresClient` set-up & configuration:

```
const { BusgresClient } = require('busgres`)

const sbConnectionString = process.env.CONNECTION_STRING

const sbEntityName = process.env.QUEUE
const sbEntityType = 'queue'

const pgClient = {
  user: process.env.USERNAME,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: process.env.PORT
}

const bgClient = new BusgresClient(sbConnectionString, sbEntityName, sbEntityType, pgClient)
```
NOTE: If using topics, provide the topic name for `sbEntityName` in place of a queue name. Additionally, ensure `sbEntityType` is set to `'topic'` and that a value for `sbEntitySubscription` is also provided.

Connecting to `BusgresClient`:

```
bgClient
  .connect()
  .then(async () => {
    console.log(
      `You are now connected to the ${process.env.DATABASE} database in PostgreSQL.`
    )

    const query = 'SELECT * FROM TABLE_NAME'
    const result = await bgClient.pgClient.query(query)
    console.log('All messages in the database:')

    result.rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row)
    })
  })
  .catch((error) => {
    console.error(
      `There has been an error connecting to your PostgreSQL database: ${error}`
    )
  })
```

The above example will confirm a connection has been established via the `BusgresClient` and will select all content from any table in the PostgreSQL database to then log it into the console (not necessary, just further confirms the PostgreSQL connection is active).<br><br>
Receiving and saving messages via `receiveMessage`:

```
const tableName = 'TABLE_NAME'
const columnNames = ['COLUMN_NAME']

bgClient.receiveMessage(tableName, columnNames)
```

`tableName` and `columnNames` must be defined so that they can be passed into the `receieveMessage` function.<br><br>
Disconnecting from `BusgresClient`:

```
bgClient.disconnect()
```

When called the connection to PostgreSQL will be terminated and will also close the Service Bus client & receiver. Messages can no longer be received from Service Bus nor saved to the PostgreSQL database.

## Configuration

`BusgresClient` - Client that contains the configuration for both Azure Service Bus & PostgreSQL. Arguments passed into the constructor of the `BusgresClient` include the Service Bus connection string (`sbConnectionString`), Service Bus entity (`sbEntityName`) i.e. name of the queue or topic, Service Bus entity type (either `'queue'` or `'topic'`), Service Bus entity subscription (name of the subscription if using topic), and the PostgreSQL client configuration (`pgClient`).<br><br>
`connect` - When called will establish connection to the PostgreSQL database.<br><br>
`saveMessage` & `receiveMessage` - Logic for inserting messages received from a Service Bus entity into a table within a PostgreSQL database.<br><br>
`disconnect` - When called will terminate the connection to PostgreSQL and close the Service Bus client and entity.

## Demo

A simple demo Node.js application called [busgres-demo](https://github.com/rtasalem/busgres-demo) was created to test the functionality of this package during its development and to provide further example of usage.

## License

This package is licensed under the MIT License. Refer to the [LICENSE](https://github.com/rtasalem/busgres/blob/main/LICENSE) file for more details.

## Feedback

Feel free to reach out if you have any suggestions for improvement.

## Dependencies

This package has a total of 2 dependencies on the following:

- [`@azure/service-bus`](https://www.npmjs.com/package/@azure/service-bus)
- [`pg`](https://www.npmjs.com/package/pg)

## Author

[Rana Salem](https://github.com/rtasalem)
