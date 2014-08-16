var express    = require('express'),
    app        = express(),
    config     = require('./config'),
    logger     = require('nlogger').logger(module);
    
require('./express_config')(app);
require('./routes')(app);

var server = app.listen(config.port, function(){
  logger.info('Listening on port %d', server.address().port);
});