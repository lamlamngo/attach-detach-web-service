/**
 * Third party dependencies
 */
const fs = require('fs');
const childproc = require('child_process').exec;
var logger = require('../utils/log'); 

module.exports = app => {
    var attachedList = {}

    /**
     * @api {get} /attach establish an user session.
     * @apiPermission everyone
     * 
     * @apiSuccess (Success 200)
     */
    app.get('/attach', (req, res) => {
        var ipStr = `${req.ip}`
        var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1)
        logger.info(`attach check ip address is ${ip}`)

        if (!(ip in attachedList)) {
            childproc(`cd /opt && python 3Gattach.py ${ip}`, (err, stdout, stderr) => {
                if (err) {
                    logger.error(err);
                    res.sendStatus(400);
                } else {
                    attachedList[ip] = true
                    res.sendStatus(200);
                }
            })
        } else {
            res.status(400).send({error: "user is already in session"});
        }
    })

    /**
     * @api {get} /detach detach an user and parse the cdr information.
     * @apiPermission everyone
     * 
     * @apiSuccess (Sucess 201) {cdr: cdr information}
     */
    app.get('/detach', (req,res) => {
        //de-establish session based on user ip
        var ipStr = `${req.ip}`;
        var ip = ipStr.substring(ipStr.lastIndexOf(":") + 1);
        
        logger.info(`detach check ip address is ${ip}`)

        if (attachedList[ip]) {
            //if user session is active
            childproc(`cd /opt && python 3Gdetach.py ${ip}`, (err, stdout, stderr) => {
                if (err) {
                    //script error
                    logger.error(err);
                    res.status(500).send({cdr : -1});
                } else {
                    //get the latest cdr file from opr server
                    childproc(`/home/alef/Lam/attach-detach-web-service/generate.sh ${ip}`, (secondErr, secondStdout, secondStderr) => {
                        if (secondErr) {
                            //script error
                            logger.error(secondErr);
                            res.status(500).send({cdr: -1});
                        } else {
                            //read the output file from cdr convert
                            fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, `utf8`, (readErr, contents) => {
                                if (readErr == null && contents !== undefined) {
                                    //output file is not empty
                                    var cdrList = contents.split(" ");

                                    if (cdrList.length === 3 && cdrList[2] !== 0) {
                                        res.status(200).send({cdr: cdr_list[2]});
                                    } else {
                                        //data information is not in this cdr outout file
                                        //get the second latest cdr file. data information should be in this file
                                        childproc(`/home/alef/Lam/attach-detach-web-service/generate_2.sh ${ip}`, (thirdErr, thirdStdout, thirdStderr) => {
                                            if (thirdErr) {
                                                logger.error(thirdErr);
                                                res.status(500).send({cdr: -1});
                                            } else {
                                                fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', (readErr2, contents2) => {

                                                    if (readErr2 == null && contents2 !== undefined) {
                                                        var cdrList2 = contents2.split(" ")

                                                        if (cdrList2.length === 3) {
                                                            res.status(200).send({cdr: cdrList2[2]})
                                                        } else {
                                                            logger.error("no data information for this ip")
                                                            res.status(500).send({cdr: -1});
                                                        }
                                                    } else {
                                                        logger.error(readErr2);
                                                        res.status(500).send({cdr: -1});
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } else {
                                        //error reading the first cdr output file
                                        //get the second latest cdr file. data information should be in this file
                                        childproc(`/home/alef/Lam/attach-detach-web-service/generate_2.sh ${ip}`, (thirdErr, thirdStdout, thirdStderr) => {
                                            if (thirdErr) {
                                                logger.error(thirdErr);
                                                res.status(500).send({cdr: -1});
                                            } else {
                                                fs.readFile(`/home/alef/Lam/attach-detach-web-service/${ip}.outp`, 'utf8', (readErr2, contents2) => {

                                                    if (readErr2 == null && contents2 !== undefined) {
                                                        var cdrList2 = contents2.split(" ")

                                                        if (cdrList2.length === 3) {
                                                            res.status(200).send({cdr: cdrList2[2]})
                                                        } else {
                                                            logger.error("no data information for this ip")
                                                            res.status(500).send({cdr: -1});
                                                        }
                                                    } else {
                                                        logger.error(readErr2);
                                                        res.status(500).send({cdr: -1});
                                                    }
                                                })
                                            }
                                        })                                   
                                }
                            })
                        }
                    })
                }
            })

            //remove ip address from attached list
            delete attachedList[ip]
        } else {
            res.status(500).send({error: 'user session is not currently active'})
        }
    })
}