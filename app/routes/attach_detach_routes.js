module.exports = function(app, childproc) {

  app.get('/detach', (req, res) => {
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
    var ip = `${req.ip}`.substring(lastIndexOf(":") + 1);
    console.log(ip);
    var test = childproc(`python /opt/3Gattach.py ${req.ip}`,
              (error, stdout, stderr) => {
                if (error == null) {
                  res.sendStatus(200);
                } else {
                  console.log(error);
                  res.sendStatus(400);
                }

              });
  })
}
