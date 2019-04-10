# attach-detach-web-service
Establish user session and record CDR information

## Dependencies
* Node: body-parser, child-process, express, fs, winston
* Rajesh's 3Gattach.py and detach.py files
* cdrparser python script
* cdrconvert commandline tool
* shell script to get and scp latest cdr files from the opr server

## End points
**GET /attach**
* establish the current user (with their ip, fetched from the request.)

**GET /detach**
* detach the user from the services (with their ip, fetched from the request.)
* returns the data that was used during the session if sucessful.

## Client
There is also a simple front end client available.
