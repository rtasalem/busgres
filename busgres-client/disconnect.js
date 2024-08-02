const disconnect = async (pgClient, receiver, sbClient) => {
  try {
    await pgClient.end()
    await receiver.close()
    await sbClient.close()
  } catch (error) {
    console.error('Error disconnecting the Busgres client:', error)
  }
}

module.exports = disconnect
