import webapp2
import urllib2
import json
import datetime

from api_key import key


class MainPage(webapp2.RequestHandler):
	def get(self):
		r = urllib2.urlopen('https://developers.google.com/events/feed/json?group=106366117871957399001&start=1356998400&end=1559812819')
		data = json.load(r)   

		past = []
		future = []

		for info in data:
			if info['temporalRelation'] == 'future':
				future.append(info)
			if info['temporalRelation'] == 'past':
				past.append(info)

		firebase_key = key

		opener = urllib2.build_opener(urllib2.HTTPHandler)
		url = 'https://gdg-kl.firebaseio.com/data/past.json?auth=' + firebase_key
		request = urllib2.Request(url, data = json.dumps(past) )
		request.add_header('content-type', 'application/json')
		request.get_method = lambda: 'PUT'
		url = opener.open(request)		

		opener = urllib2.build_opener(urllib2.HTTPHandler)
		url = 'https://gdg-kl.firebaseio.com/data/future.json?auth=' + firebase_key
		request = urllib2.Request(url, data = json.dumps(future) )
		request.add_header('content-type', 'application/json')
		request.get_method = lambda: 'PUT'
		url = opener.open(request)

		time = {'time': str(datetime.datetime.now())}
		opener = urllib2.build_opener(urllib2.HTTPHandler)
		url = 'https://gdg-kl.firebaseio.com/data/time.json?auth=' + firebase_key
		request = urllib2.Request(url, data = json.dumps(time) )
		request.add_header('content-type', 'application/json')
		request.get_method = lambda: 'PUT'
		url = opener.open(request)								

		self.response.headers['Content-Type'] = 'text/plain'
		self.response.write("success")

app = webapp2.WSGIApplication([
	('/cron/', MainPage),
	], debug=True)