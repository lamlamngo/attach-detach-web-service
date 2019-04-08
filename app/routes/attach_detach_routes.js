module.exports = function(app, childproc, logger) {
  var attached_list = {}

  app.get('/detach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    logger.info(`detach check ip address is ${ip}`)
    if (attached_list[ip]) {
      var test = childproc(`cd /opt && python 3Gdetach.py ${ip}`,
                (error, stdout, stderr) => {
                  if (error == null) {
                    var run = childproc(`/home/alef/Lam/attach-detach-web-service/generate.sh ${ip}`, 
                      (error_1, stdout_1,stderr_1) => {
                        if (error_1 == null) {
                            var fs = require('fs');
                            fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', function(err, contents) {

                               if (contents != undefined) {
                                var cdr_list = contents.split(" ")

                                if (cdr_list.length == 3 && cdr_list[2] != 0) {
                                  res.send({cdr: cdr_list[2]})
                                } else {
                                  var second_run = childproc(`/home/alef/Lam/attach-detach-web-service/generate_2.sh ${ip}`,
                                  (error_2, stdout_2, stderr_2) => {
                                    if (error_2 == null) {
                                     var fs = require('fs');
 
                                     fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', function(err, contents_2) {
                                
                                       if (contents_2 != undefined) {
                                        var cdr_list_2 = contents_2.split(" ")
        
                                        if (cdr_list_2.length == 3) {
                                          res.send({cdr: cdr_list_2[2]})
                                        } else {
                                          res.send({cdr: -1})
                                          logger.error("wrong length");
                                        }
                                       } else {
                                         res.send({cdr: -1});
                                       }
                                     })
                                    }
                                  })
                                }
                               } else {
                                 var second_run = childproc(`/home/alef/Lam/attach-detach-web-service/generate_2.sh ${ip}`,
                                 (error_2, stdout_2, stderr_2) => {
                                   if (error_2 == null) {
                                    var fs = require('fs');

                                    fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', function(err, contents_2) {
                               
                                      if (contents_2 != undefined) {
                                       var cdr_list = contents_2.split(" ")
       
                                       if (cdr_list.length == 3) {

                                         res.send({cdr: cdr_list[2]})
                                       } else {
                                         res.send({cdr: -1})
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
                    logger.error(error);
                    res.sendStatus(400);
                  }

                });
    }
  })

  app.get('/status', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    logger.info(`status check ip address is ${ip}`);

    if (attached_list[ip]) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  })

  app.get('/attach', (req, res) => {
    var ipStr = `${req.ip}`;
    var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
    logger.info(`attach check ip address is ${ip}`)

    if (!(ip in attached_list)) {
      var test = childproc(`cd /opt && python 3Gattach.py ${ip}`,
                (error, stdout, stderr) => {
                  if (error == null) {
                    attached_list[ip] = true
                    res.sendStatus(200);
                  } else {
                    logger.error(error);
                    res.sendStatus(400);
                  }

                });
    }
  })
}
