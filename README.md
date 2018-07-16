# DIY warm floor thermostat with Apple HomeKit support

Device is 5-zone warm floor temperature controller and used to replace 5x Danfoss ECtemp Next Plus programmable regulator (or other thermostats with NTC\PTC sensors).
Total cost is under 100USD with Raspberry Pi 3 model B+.
Device can be used without HomeKit abilities, just remove Raspberry Pi. It will turn device to usual 5-zone manual controlled thermostat.

# Important

1. "PCB Layout Designer 6.0" software needed to open files from PCB folder.
2. Raspberry Pi board uses 3V3 logic levels, so [I2C](https://en.wikipedia.org/wiki/I2C) bus pullups must be set to 3.3V to avoid burnout of RPi pins. Comm LED on MCUs board indicates I2C activity.
3. I2Cb (b = buffered, long-range I2C) pullups used if there is no "neighbor" on buffered I2C bus with pullup resistors. Long-range (up to 20m on Cat.5 twisted pair) I2C communications done by P82B715 chip. Required for other\another devices control.
4. Default (hardcoded in firmware) sensor type is NTC with nominal resistanse = 15KOhm, can be tuned if needed. The same nominal resistors used on MCUs board for correct value reading.
5. PSU used: MeanWell PS-25-5 (out 5V 5A). It's input (220VAC) connected to 1st zone relay input, so no additional wire needed.
6. Knob used part number: 41026-1 (diameter = 45.1mm) -  see Knob.pdf in Enclosure folder.
7. Enclosure is "3D-printed" with ABS plastic (hotbed = 90'C, hotend = 238'C, infill = 50%).
8. Firmware\software available upon request gfr20141201@gmail.com

Live bredboard demo:

[![Video](http://img.youtube.com/vi/IP8oJ3PyP9c/0.jpg)](https://www.youtube.com/watch?v=IP8oJ3PyP9c)
