module.exports = function(app, childproc) {
  var attached_list = {}

  app.get('/detach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    console.log(`detach check ip address is ${ip}`)
    if (attached_list[ip]) {
      var test = childproc(`cd /opt && python 3Gdetach.py ${ip}`,
                (error, stdout, stderr) => {
                  if (error == null) {
                    res.sendStatus(200);
                    delete attached_list[ip]
                  } else {
                    console.log(error);
                    res.sendStatus(400);
                  }

                });
    }
  })

  app.get('/status', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    console.log(`status check ip address is ${ip}`)

    if (attached_list[ip]) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  })

  app.get('/attach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    console.log(`attach check ip address is ${ip}`)

    if (!(ip in attached_list)) {
      var test = childproc(`cd /opt && python 3Gattach.py ${ip}`,
                (error, stdout, stderr) => {
                  if (error == null) {
                    res.sendStatus(200);
                    attached_list[ip] = true
                  } else {
                    console.log(error);
                    res.sendStatus(400);
                  }

                });
    }
  })
}
