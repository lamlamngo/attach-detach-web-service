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
                    var run = childproc(`/home/alef/Lam/attach-detach-web-service/generate.sh ${ip}`, 
                      (error_1, stdout_1,stderr_1) => {
                        console.log("IN HERE")
                        console.log(error_1);
                        console.log(stdout_1);
                        if (error_1 == null) {
                            var fs = require('fs');
                            fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', function(err, contents) {
                               console.log(contents);
                               
                               if (contents != undefined) {
                                var cdr_list = contents.split(" ")

                                if (cdr_list.length == 3) {
                                  console.log(cdr_list[2])

                                  res.send({cdr: cdr_list[2]})
                                } else {
                                  res.send({cdr: -1});
                                  console.log("wrong length");
                                }
                               } else {
                                 var second_run = childproc(`/home/alef/Lam/attach-detach-web-service/generate_2.sh ${ip}`,
                                 (error_2, stdout_2, stderr_2) => {
                                   console.log("in here 222")
                                   if (error_2 == null) {
                                    var fs = require('fs');

                                    fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', function(err, contents_2) {
                                      console.log(contents_2);
                               
                                      if (contents_2 != undefined) {
                                       var cdr_list = contents_2.split(" ")
       
                                       if (cdr_list.length == 3) {
                                         console.log(cdr_list[2])

                                         res.send({cdr: cdr_list[2]})
                                       } else {
                                         res.send({cdr: -1})
                                         console.log("wrong length");
                                       }
                                      } else {
                                        res.send({cdr: -1});
                                      }
                                    })
                                   }
                                 })
                               }
                            }); 
                        }
                    })
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
