import { Driver } from "../models/Driver";

var express = require('express');
var router = express.Router();

/* GET drivers listing. */
router.get('/', function(req: any, res: any, next: any) {
  var drivers = req.app.get('drivers');
  res.status(200).json(drivers);
});

/* POST driver overtake. */
router.post('/:driverId/overtake', function(req: any, res: any, next: any) {
  var drivers = req.app.get('drivers');
  var driver = drivers.find((d: Driver) => d.id == req.params.driverId);
  if (driver?.place > 1) {
    var driver_in_front = drivers.find((d: Driver) => d.place == (driver.place - 1));
    driver.place--;
    driver_in_front.place++;
  }
  if (!driver) {
    console.log(`The Driver ID not found: ${req.params.driverId}`)
    res.status(404);
  }
  else {
    res.status(200).json(driver);
  }
});

module.exports = router;
