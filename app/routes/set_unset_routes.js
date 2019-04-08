module.exports = function(app) {
  var result = undefined;

  app.post('/set', (req, res) => {
    logger.info(req.body)
    result = req.body
  })

  app.get('/unset', (req, res) => {
    res.send(result)
  })
}
