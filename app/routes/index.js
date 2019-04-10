const attach_detach_routes = require('./attach_detach_routes');

module.exports = app => {
  attach_detach_routes(app);
};
