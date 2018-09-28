module.exports = function(app, childproc) {
  var result = undefined;

  app.post('/detach', (req, res) => {
    var test = childproc(`python /opt/3Gdetach.py ${req.ip}`,
              (error, stdout, stderr) => {
                if (error == null) {
                  res.sendStatus(200);
                } else {
                  res.sendStatus(400);
                }
              });
  })

  app.get('/attach', (req, res) => {
    var test = childproc(`python /opt/3Gattach.py ${req.ip}`,
              (error, stdout, stderr) => {
                if (error == null) {
                  res.sendStatus(200);
                } else {
                  res.sendStatus(400);
                }

              });
  })
}
