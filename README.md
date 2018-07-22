# DIY warm floor thermostat with Apple HomeKit support

Device is 5-zone warm floor temperature controller and used to replace 5x Danfoss ECtemp Next Plus programmable regulator (or other thermostats with NTC\PTC sensors).
Total cost is under 100USD with Raspberry Pi 3 model B+.
Device can be used without HomeKit abilities, just remove Raspberry Pi. It will turn device to usual 5-zone manual controlled thermostat.

# Important

0. "Head MCU" is Arduino Nano V3, USB port used for debug. "Sensor MCU" is AtMega328P-PU @8MHz internal clock, placed on same board with Head MCU. "Display MCU" is AtMega328P-PU @8MHz internal clock, located on digital display board.
1. "PCB Layout Designer 6.0" software needed to open files from PCB folder.
2. Raspberry Pi board uses 3V3 logic levels, so [I2C](https://en.wikipedia.org/wiki/I2C) bus pullups must be set to 3.3V to avoid burnout of RPi pins. Comm LED on MCUs board indicates I2C activity.
3. I2Cb (b = buffered, long-range I2C) pullups used if there is no "neighbor" on buffered I2C bus with pullup resistors. Long-range (up to 20m on Cat.5 twisted pair) I2C communications done by P82B715 chip. Required for other\another devices control.
4. ~~Default (hardcoded in firmware) sensor type is NTC with nominal resistanse = 15KOhm and B = 3528, can be tuned if needed.~~ Use setup mode (command "3") to change NTC B-coefficient, nominal NTC resistance and other sensor parameters The same nominal resistors as nominal NTC recommended on MCUs board for correct value reading.
5. PSU used: MeanWell PS-25-5 (out 5V 5A). It's input (220VAC) connected to 1st zone relay input, so no additional wire needed.
6. Knob used part number: 41026-1 (diameter = 45.1mm) -  see Knob.pdf in Enclosure folder.
7. Enclosure is "3D-printed" with ABS plastic (hotbed = 90'C, hotend = 238'C, infill = ~~50%~~ 60% recommended).
8. Celsium\Farenheit display mode affects only hardware display on device. I don't know is there Apple bug or mine one, but I can't achieve stable toggling temperature units in Homekit app, it just "freezes" for 1-2 minutes, probably due to large difference between consequental values. To be continued.

Finished device:

<img src="https://github.com/perdidor/homebridge-diy-warmfloorcontroller/blob/master/Photos/finish.jpeg" width="auto">

Live demo:

[![Video](http://img.youtube.com/vi/tgr7KWk2XkE/0.jpg)](https://www.youtube.com/watch?v=tgr7KWk2XkE)
