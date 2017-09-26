# mqtt-web-panel
A real-time web interface for MQTT.

![Screencapture](screen.png)

[![Build Status](https://travis-ci.org/mingruport/mqtt-web-panel.svg?branch=master)](https://travis-ci.org/mingruport/mqtt-web-panel)

## Features
* Real-time update data
* Displays statistics for the selected period
* Responsive interface

## Getting Started
### Install locally
```
git clone git@github.com:mingruport/mqtt-web-panel.git
cd mqtt-web-panel
npm install
npm start
```
Your app should now be running on [localhost:3000](localhost:3000).

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
## API
* ```GET /api/topics/``` Find all topics.
* ```GET /api/topics/{friendlyId}``` 	Find a single topic by Friendly ID.
* ```POST /api/topics/``` Create a new topic.
* ```PUT /api/topics/{friendlyId}``` Update entire topic document.
* ```DELETE /api/topics/{friendlyId}``` Delete a topic by Friendly ID

* ```GET /api/timeseries/``` Return statistics data.

## License
This project is licensed under the MIT License.
