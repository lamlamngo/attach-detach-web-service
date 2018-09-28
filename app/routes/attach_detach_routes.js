module.exports = function(app, childproc) {

  app.get('/detach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    var test = childproc(`cd /opt && python 3Gdetach.py ${ip}`,
              (error, stdout, stderr) => {
                if (error == null) {
                  res.sendStatus(200);
                } else {
                  console.log(error);
                  res.sendStatus(400);
                }

              });
  })

  app.get('/attach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    var test = childproc(`cd /opt && python 3Gattach.py ${ip}`,
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
