module.exports = function(app, childproc) {
  var result = undefined;

  app.post('/detach', (req, res) => {
    console.log(req.body)
    result = req.body
  })

  app.get('/attach', (req, res) => {
    var test = childproc(`echo "abcd"`,
              (error, stdout, stderr) => {
                res.sendStatus(200);
              });
  })
}
