const disconnect = async (postgresClient, receiver, serviceBusClient) => {
  try {
    await postgresClient.end()
    await receiver.close()
    await serviceBusClient.close()
  } catch (error) {
    throw new Error('Error disconnecting:', error)
  }
}

module.exports = disconnect
