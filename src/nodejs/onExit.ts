function onExit(fn: () => void) {
  // do something when app is closing
  process.on('exit', fn)

  // catches ctrl+c event
  process.on('SIGINT', fn)

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', fn)
  process.on('SIGUSR2', fn)

  // catches uncaught exceptions
  process.on('uncaughtException', fn)
}
