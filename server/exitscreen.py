#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
import time
import datetime
import tornado.ioloop
import tornado.web
import ephem

def getdata(lat, lon, siteids):
	### Settings:
	#position = {"lat":59.29, "lon":18.03}
	#siteids = ["1534",]
	slkey = ''

	### Prepare out data:
	outdata = {}
	outdata["departures"] = []
	outdata["weather"] = []

	### Get weather data:
	r = requests.get('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/'+lat+'/lon/'+lon+'/data.json')
	wdata = r.json()
	
	sthml = ephem.city('Stockholm')
	sun = ephem.Sun()

	### Use 4h weather data:
	for hourdata in wdata['timeseries']:
		datatime = time.gmtime(time.mktime(time.strptime(hourdata['validTime'],"%Y-%m-%dT%H:%M:%SZ")))
		sthml.date = time.strftime('%Y/%m/%d %H:%M', datatime)
		sunset = time.strptime(str(sthml.next_setting(sun)), "%Y/%m/%d %H:%M:%S")
		sunrise = time.strptime(str(sthml.next_rising(sun)), "%Y/%m/%d %H:%M:%S")
		
		if time.mktime(datatime) > time.time():	
			day = False
			if time.mktime(sunrise) > time.mktime(sunset) :
				day = True;
			
			outdata["weather"].append(
										{
										"time":hourdata['validTime'],
										"temp":hourdata['t'],	
										"rain":hourdata['pit'],
										"sun":(10.0-hourdata['tcc'])/10.0,
										"windspeed":hourdata['ws'],
										"day":day,
										"topwindspeed":hourdata['gust'],
										"thunderstormprobaility":hourdata['tstm'],
										"visibility":hourdata['vis'],
										"winddirection":hourdata['wd']
										}
									  )
			if len(outdata["weather"]) > 11:
				break

	for stop in siteids:
		r = requests.get('http://api.sl.se/api2/realtimedepartures.json?key='+slkey+'&siteid='+stop+'&timewindow=60')
		ddata = r.json()

		for departure in ddata['ResponseData']['Metros']:
			minutes = departure["DisplayTime"].split(' ')
			try:
				minutes = int(minutes[0]) * 60 
			except:
				minutes = 60
				
			fixtime = time.time() + minutes
			deptime = fixtime
		
			outdata["departures"].append({
										"tabletime":int(fixtime),
										"stopname":departure['StopAreaName'],
										"stopsite":departure['SiteId'],
										"stoparea":str(departure['SiteId'])+"."+str(departure['GroupOfLineId']),
										"stoppoint":str(departure['SiteId'])+"."+str(departure['GroupOfLineId'])+"."+str(departure['JourneyDirection']),
										"type":departure['TransportMode'],
										"id":departure['LineNumber'],
										"direction":departure['Destination'],
										"time":int(deptime)}
										)
		
		for departure in ddata['ResponseData']['Trains']:
			fixtime = time.mktime(time.strptime(departure['TimeTabledDateTime'], "%Y-%m-%dT%H:%M:%S"))
			try:
				deptime = time.mktime(time.strptime(departure['ExpectedDateTime'], "%Y-%m-%dT%H:%M:%S"))
			except:
				deptime = fixtime
		
			outdata["departures"].append({
										"tabletime":int(fixtime),
										"stopname":departure['StopAreaName'],
										"stopsite":departure['SiteId'],
										"stoparea":departure['StopAreaNumber'],
										"stoppoint":departure['StopPointNumber'],
										"type":departure['TransportMode'],
										"id":departure['LineNumber'],
										"direction":departure['Destination'],
										"time":int(deptime)}
										)

		for departure in ddata['ResponseData']['Buses']:
			fixtime = time.mktime(time.strptime(departure['TimeTabledDateTime'], "%Y-%m-%dT%H:%M:%S"))
			try:
				deptime = time.mktime(time.strptime(departure['ExpectedDateTime'], "%Y-%m-%dT%H:%M:%S"))
			except:
				deptime = fixtime
		
			outdata["departures"].append({
										"tabletime":int(fixtime),
										"stopname":departure['StopAreaName'],
										"stopsite":departure['SiteId'],
										"stoparea":departure['StopAreaNumber'],
										"stoppoint":departure['StopPointNumber'],
										"type":departure['TransportMode'],
										"id":departure['LineNumber'],
										"direction":departure['Destination'],
										"time":int(deptime)}
										)
										
		for departure in ddata['ResponseData']['Trams']:
			fixtime = time.mktime(time.strptime(departure['TimeTabledDateTime'], "%Y-%m-%dT%H:%M:%S"))
			try:
				deptime = time.mktime(time.strptime(departure['ExpectedDateTime'], "%Y-%m-%dT%H:%M:%S"))
			except:
				deptime = fixtime
		
			outdata["departures"].append({
										"tabletime":int(fixtime),
										"stopname":departure['StopAreaName'],
										"stopsite":departure['SiteId'],
										"stoparea":departure['StopAreaNumber'],
										"stoppoint":departure['StopPointNumber'],
										"type":departure['TransportMode'],
										"id":departure['LineNumber'],
										"direction":departure['Destination'],
										"time":int(deptime)}
										)
										
	return outdata
		

class MainHandler(tornado.web.RequestHandler):
    def get(self):
    	self.set_header("Access-Control-Allow-Origin", "*")
    	lon = self.get_argument('lon', True)
        lat = self.get_argument('lat', True)
        sites = self.get_argument('sites', True)
        sites = sites.split(',')
        self.write(getdata(lat, lon,  sites ))

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(9165)
    tornado.ioloop.IOLoop.instance().start()