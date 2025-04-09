export async function stopBusgres (dbClient, messageClient, receiver) {
  try {
    await dbClient.end()
    await receiver.close()
    await messageClient.close()
  } catch (error) {
    console.error('Error disconnecting from Busgres:', { cause: error })
  }
}
