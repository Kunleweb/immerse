const express = require('express');
const app = express()
const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));
const tourControl = require('./../Newpcontrol/tourControl')


const router = express.Router()

router
.route('/')
.get(tourControl.getalltours)
.post(tourControl.createTour)

router
.route('/:id')
.get(tourControl.gettour) 


module.exports = router;