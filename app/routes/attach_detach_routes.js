module.exports = function(app) {
  var result = undefined;

  app.post('/detach', (req, res) => {
    console.log(req.body)
    result = req.body
  })

  app.get('/attach', (req, res) => {
    res.send(result)
  })
}
