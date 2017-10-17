# MQTT Web Panel
A real-time web interface for MQTT.

[![Build Status](https://travis-ci.org/mingruport/mqtt-web-panel.svg?branch=master)](https://travis-ci.org/mingruport/mqtt-web-panel)

![Screencapture](screen.png)

---

## Live Demo
A demo version is available at this [link](https://mqtt-panel-demo.herokuapp.com/).
 
## Features
* Real-time update data
* Displays statistics for the selected period
* Responsive interface
* RESTful API

## Requirements
* Latest Node.js and npm
* MongoDB

## Getting Started
### Install locally
```
git clone git@github.com:mingruport/mqtt-web-panel.git
cd mqtt-web-panel
npm install
npm start
```
Your app should now be running on [localhost:3000](http://localhost:3000).

### Install on Raspberry Pi

Install Node.js:
```
$ sudo apt install nodejs
 ```
Check installation:
 ```
node -v
```
Install mqtt-web-panel:
```
git clone git@github.com:mingruport/mqtt-web-panel.git
cd mqtt-web-panel
npm install
npm start
```

### Deploying to Heroku
```
heroku create
git push heroku master
heroku open
```
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/mingruport/mqtt-web-panel)

### Testing

Execute this command to run tests:
```
npm test
```

## API
* ```GET /api/topics/``` Find all topics.
* ```GET /api/topics/{friendlyId}``` 	Find a single topic by Friendly ID.
* ```POST /api/topics/``` Create a new topic.
* ```PUT /api/topics/{friendlyId}``` Update entire topic document.
* ```DELETE /api/topics/{friendlyId}``` Delete a topic by Friendly ID

* ```GET api/timeseries?friendlyId={friendlyId}&period={period}``` Return statistics data.

## License
This project is licensed under the MIT License.
