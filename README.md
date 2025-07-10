# Busgres
Service <u>BUS</u> + Post<u>GRES</u> = Busgres

[Busgres](https://www.npmjs.com/package/busgres) is a Node.js package that will receive a message from an Azure Service Bus queue or topic and save it into a PostgreSQL database. It abstracts the [`@azure/service-bus`](https://www.npmjs.com/package/@azure/service-bus) and [`pg` (node-postgres)](https://www.npmjs.com/package/pg) packages for Service Bus and Postgres integration.

## Installation

This package can be installed using NPM:

```
npm i busgres
```

## Usage

`BusgresClient` set-up & configuration:

```javascript
import { BusgresClient } from 'busgres'
import 'dotenv/config'

const busgresClient = new BusgresClient({
  serviceBus: {
        connectionString: process.env.SB_CONNECTION_STRING,
    entity: process.env.SB_ENTITY,
    entityType: 'queue'
  },
  postgres: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
  }
})

const tableName = 'busgres'
const columnNames = ['message']
```

NOTE: If using topics, provide the topic name for `sbEntityName` in place of a queue name. Additionally, ensure `sbEntityType` is set to `'topic'` and that a value for `sbEntitySubscription` is also provided.  

Starting the `BusgresClient` connection:

```javascript
import { 
  busgresClient, 
  tableNames, 
  columnNames 
} from './busgres-config.js'

await busgresClient.start(tableName, columnNames)

process.on('SIGINT', async () => {
  await busgresClient.stop()
  process.exit()
})

```
With the above set-up and configuration a basic working `BusgresClient` connection can be established.

## Demo

A simple demo Node.js application, [busgres-demo](https://github.com/rtasalem/busgres-demo) was created to test the functionality of this package during its development and to provide further example of usage.

## License

This package is licensed under the MIT License. Refer to the [LICENSE](https://github.com/rtasalem/busgres/blob/main/LICENSE) file for more details.

## Feedback

Feel free to reach out if you have any suggestions for improvement or further development.

## Dependencies

This package has a total of 2 dependencies on the following:

- [`@azure/service-bus`](https://www.npmjs.com/package/@azure/service-bus)
- [`pg`](https://www.npmjs.com/package/pg)

## Author

[Rana Salem](https://github.com/rtasalem)
