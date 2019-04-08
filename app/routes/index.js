const attach_detach_routes = require('./attach_detach_routes');
const set_unset_routes = require('./set_unset_routes');

module.exports = function(app, childproc, logger) {
  attach_detach_routes(app,childproc, logger);
  set_unset_routes(app);
};
