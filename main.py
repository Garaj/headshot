import json
import requests
import datetime, time
import subprocess
from requests.exceptions import RequestException
from parse_rest.connection import register
from parse_rest.datatypes import Object
from parse_rest.datatypes import ACL
from HeadCount import HeadCount
# from xml.etree import ElementTree

import config

#Parse initialization
register(config.APPLICATION_ID, config.REST_API_KEY, master_key = config.MASTER_KEY)

ip = config.router['ip']

try:
	#Router login
	payload = config.router
	loginReq = requests.post('http://%s/cgi-bin/login' % ip, data = payload)

	#Router Wi-Fi devices request
	headers = {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	formdata = '<xmlrequest version="1.0.1"><command inst="cfgmgr-0"><key>begin_transaction</key><value>wireless-0</value></command><command inst="cfgmgr-0"><key>begin_transaction</key><value>wireless-1</value></command><query inst="wireless-0"><key>ap0_sta_list</key><value/></query><query inst="wireless-0"><key>ap1_sta_list</key><value/></query><query inst="wireless-0"><key>ap2_sta_list</key><value/></query><query inst="wireless-0"><key>ap3_sta_list</key><value/></query><query inst="wireless-1"><key>ap0_sta_list</key><value/></query><query inst="wireless-1"><key>ap1_sta_list</key><value/></query><query inst="wireless-1"><key>ap2_sta_list</key><value/></query><query inst="wireless-1"><key>ap3_sta_list</key><value/></query><command inst="cfgmgr-0"><key>commit</key><value>wireless-0</value></command><command inst="cfgmgr-0"><key>commit</key><value>wireless-1</value></command><command inst="cfgmgr-0"><key>end_transaction</key><value>wireless-0</value></command><command inst="cfgmgr-0"><key>end_transaction</key><value>wireless-1</value></command></xmlrequest>'
	r = requests.post('http://%s/cgi-bin/webapp' % ip, data = formdata, cookies = loginReq.cookies)

	# XML Parse
	# tree = ElementTree.fromstring(r.content)

	count = r.text.count(".mac")

	if count > 0:
		message = "Open! %d device(s) connected." % count
	else:
		message = "Closed!"

except RequestException:
	count = -1;
	message = "Status Unknown!"

headCount = HeadCount()
headCount.ACL = ACL()
headCount.count = count
headCount.save()

state = {
		'state': {
			'open': None if count < 0 else count > 0, 
			'lastchange': int(time.mktime(headCount.updatedAt.timetuple())),
			'headcount': count,
			'message': message
		}
	}

subprocess.call('curl --data-urlencode sensors=\'{"state":{"open":%s}}\' --data key=%s http://spaceapi.net/new/space/garajco/sensor/set' % ("true" if count>0 else "false", config.SPACE_API_KEY), shell=True)

print json.dumps(state, indent=4)
