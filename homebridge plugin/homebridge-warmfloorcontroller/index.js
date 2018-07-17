var i2c = require('i2c');
var sendTargetState = 1;
var sendTargetTemp = 1;
var address = 0x33;
var wire = new i2c(address, {device: '/dev/i2c-1'});
var acc, Service, Characteristic;
var currentTemperature = 0;
var targetTemperature = 0;
var temperatureDisplayUnits = 0;
var currentHeatingCoolingState = 0;
var targetHeatingCoolingState = 0;
var consolelog;


module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-warmfloorcontroller', 'Thermostat', FloorThermostat);
};

function FloorThermostat(log, config) {
	consolelog = log;
	this.name = config["name"];
	this.manufacturer = config["manufacturer"];
	this.model = config["model"];
	this.serial = config["serial"];
	this.firmwareRevision = config["firmwareRevision"];
	acc = this;
	consolelog("Initialization completed");
	this.statePolling();
	}

FloorThermostat.prototype.getServices = function () {
	  var services = [],
	  informationService = new Service.AccessoryInformation();
	  informationService
	  .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
          .setCharacteristic(Characteristic.Model, this.model)
          .setCharacteristic(Characteristic.SerialNumber, this.serial);
	  services.push(informationService);
	  WarmFloorService = new Service.Thermostat(this.name);
          WarmFloorService
          .getCharacteristic(Characteristic.CurrentTemperature)
	  .setProps({
	    minValue: -10,
	    maxValue: 60,
	    minStep: 1
	  });
	  WarmFloorService
	  .getCharacteristic(Characteristic.CurrentTemperature)
          .on('get', this.getCurrentTemperature.bind(this));
	  WarmFloorService
          .getCharacteristic(Characteristic.TargetTemperature)	
	  .setProps({
            minValue: 10,
            maxValue: 45,
            minStep: 1
          });
	  WarmFloorService
	  .getCharacteristic(Characteristic.TargetTemperature)
          .on('set', (value, callback) => {
	    if (sendTargetTemp == 1) {
		wire.write([value, 3], function(err) {});
		consolelog("New TargetTemperature: " + value);
              } else {
                  sendTargetTemp = 1;
                };
	      callback(null);
	    })
	  .on('get', this.getTargetTemperature.bind(this));
	  WarmFloorService
	  .getCharacteristic(Characteristic.TemperatureDisplayUnits)
          .on('get', this.getTemperatureDisplayUnits.bind(this))
	  .on('set', (value, callback) => {
	    value = 0;
            callback(null);
            });
	  WarmFloorService
	  .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
          .on('get', this.getCurrentHeatingCoolingState.bind(this));
	  WarmFloorService
	  .getCharacteristic(Characteristic.TargetHeatingCoolingState)
          .on('get', this.getTargetHeatingCoolingState.bind(this))
	  .on('set', (value, callback) => {
	    if (value != 0 && value != 1) {
		  value = 1;
		};
            if (sendTargetState == 1) {
	      wire.write([0, value], function(err) {});
	      consolelog("New TargetHeatingCoolingState: " + value);
	      } else {
		  sendTargetState = 1;
		};
            callback(null);
            });
  	  services.push(WarmFloorService);
  	  this.service = WarmFloorService;
          return services;
	}

FloorThermostat.prototype.update = function () {
	wire.read(3, function(err, res) {
	  if (!err) {
	      if (currentHeatingCoolingState != res[2]) {
		consolelog("New state from device: " + res[2]);
		currentHeatingCoolingState = res[2];
	      }
	      if (targetTemperature != res[1]) {
                consolelog("New target temperature from device: " + res[1]);
		targetTemperature = res[1];
		sendTargetTemp = 0;
		WarmFloorService.setCharacteristic(Characteristic.TargetTemperature, targetTemperature);
              }
	      if (currentTemperature != res[0]) {
                //consolelog("New current temperature from device: " + res[0]);
		currentTemperature = res[0];
                WarmFloorService.setCharacteristic(Characteristic.CurrentTemperature, currentTemperature);
              }
	      sendTargetState = 0;
              WarmFloorService.setCharacteristic(Characteristic.CurrentHeatingCoolingState, currentHeatingCoolingState);
              WarmFloorService.setCharacteristic(Characteristic.TargetHeatingCoolingState, currentHeatingCoolingState);
	    }
	  });
        }

FloorThermostat.prototype.statePolling = function () {
	  this.tout = setTimeout(function () {
	    acc.update();
            acc.statePolling();
	  }, 1000);
	}

FloorThermostat.prototype.getCurrentTemperature = function (callback) {
          callback(null, currentTemperature);
	}

FloorThermostat.prototype.getTargetTemperature = function (callback) {
          callback(null, targetTemperature);
        }

FloorThermostat.prototype.getTemperatureDisplayUnits = function (callback) {
	  callback(null, 0);
        }

FloorThermostat.prototype.getCurrentHeatingCoolingState = function (callback) {
          callback(null, currentHeatingCoolingState);
        }

FloorThermostat.prototype.getTargetHeatingCoolingState = function (callback) {
          callback(null, targetHeatingCoolingState);
        }
