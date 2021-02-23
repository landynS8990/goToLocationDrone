from flask import Flask, render_template, request, jsonify
from Naked.toolshed.shell import execute_js, muterun_js
from geopy.distance import geodesic
import numpy as np
import math
import subprocess

app = Flask(__name__)


def distance(pointA, pointB):

	lat1 = pointA[0]
	lon1 = pointA[1]
	lat2 = pointB[0]
	lon2 = pointB[1]
	radius = 6371000000  # m

	dlat = math.radians(lat2 - lat1)
	dlon = math.radians(lon2 - lon1)
	a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
	     math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
	     math.sin(dlon / 2) * math.sin(dlon / 2))
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
	d = radius * c

	return d

def calculate_initial_compass_bearing(pointA, pointB):
	if (type(pointA) != tuple) or (type(pointB) != tuple):
		raise TypeError("Only tuples are supported as arguments")

	lat1 = math.radians(pointA[0])
	lat2 = math.radians(pointB[0])

	diffLong = math.radians(pointB[1] - pointA[1])

	x = math.sin(diffLong) * math.cos(lat2)
	y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1)
		* math.cos(lat2) * math.cos(diffLong))

	initial_bearing = math.atan2(x, y)
	initial_bearing = math.degrees(initial_bearing)
	compass_bearing = (initial_bearing + 360) % 360

	return compass_bearing

@app.route('/')
def index():
	return render_template('index.html')


@app.route('/api/say_name', methods=['POST'])
def say_name():
	json = request.get_json()
	first_name = json['first_name']
	last_name = json['last_name']
	p1 = first_name.split(", ")
	p2 = last_name.split(", ")
	point1 = (float(p1[0]), float(p1[1]))
	try:
		point2 = (float(p2[0]), float(p2[1]))
	except:
		point2 = (43.825611, -79.496899)
	print(point1)
	print(point2)
	deeg = calculate_initial_compass_bearing(point1, point2)
	dist = geodesic(point1, point2).meters
	dg = deeg + 180
	d = 0
	if dg > 360:
		d = dg - 360
	else:
		d = dg

	if d > 180:
		d = 0 - (180 + (180 - d))
	w = open("data.txt", "w")
	a = open("distance.txt", "w")
	w.write(str(d))
	a.write(str(dist))
	return jsonify(first_name=first_name, last_name=last_name, deeg=d, dist=dist)


if __name__ == '__main__':
	app.run(debug=True)
