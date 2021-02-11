#!/usr/bin/python3

import sys
import os
import serial

def checkCommands(argv):
    arduino = serial.Serial('COM3', 9600)

    if (len(argv) != 2):
        raise Exception("not enough arguments")
    else:
        if (argv[0] == "led"):
            if (argv[1] == "on"):
                print('Led turned on!')
                sys.stdout.flush()
                arduino.write('ledon'.encode())
            if (argv[1] == "off"):
                arduino.write('ledoff'.encode())
                print('Led turned off!')
                sys.stdout.flush()

def main(argv):
    try:
        checkCommands(argv)
    except Exception as e:
        print("Error : {}".format(e) , file=sys.stderr)
        sys.exit(84)

if (__name__ == "__main__"):
    main(sys.argv[1:])