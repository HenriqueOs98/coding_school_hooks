onBootstrap((e) => {
    e.next()

    // This will log to both the server console and admin UI
    $log.info("App initialized!")
    
    // You can also use different log levels
    $log.debug("This is a debug message")
    $log.warn("This is a warning message")
    $log.error("This is an error message")
})
