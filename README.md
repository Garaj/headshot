Headshot
========

Python script that logs the device connections in the physical router in [Garaj Coworking Space](http://garaj.co/) to cloud.

- It first authenticate to the Airties router, and then queries the connected WiFi devices in the network.
- The count of the connected devices is uploaded to a table in [Parse](http://parse.com).
- And the connectivity information is given as an output as stated in [Space API](http://spaceapi.net/)
- Space API state is updated with a weird GET call to a weird Space API endpoint. 


Setup
-----

The project is just a basic script that gets the information from the router and sends to Parse servers using [ParsePy](https://github.com/dgrtwo/ParsePy) project. 

- Setup a computer (likely a [Raspberry PI](https://www.raspberrypi.org/help/noobs-setup/))
- Install pip
```
sudo apt-get install python-pip
```
- Install ParsePy
```
pip install git+https://github.com/dgrtwo/ParsePy.git
```
- Install Python Requests
```
pip install requests
```
- Clone the project. 
- Create a `config.py` file with the following constants:
```
APPLICATION_ID = ""
REST_API_KEY = ""
MASTER_KEY = ""

SPACE_API_KEY = ""

router = {
	'ip': '',
	'user': '',
	'password': ''
}
```
- Add a cron job for this script to run in every X mins.


Future Work
-----------

- Instead of just sending the number of devices, MAC Addresses can be logged. 
  - To do this, last MAC Addresses can be cached (or requeried through Parse) and be compared with the new ones. 
  - Then, connectivity losses and new connection will be logged. 
- Space API cached endpoint it weird. Instead, we can setup a really small endpoint (which can reside in Raspberry PI or can be a Cloud Code in Parse) that outputs reqiured Space API format.
  - That way we can output detailed information about the open/close state of the space e.g. last change timestamp, devices connected.

