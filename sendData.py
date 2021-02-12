#!/usr/bin/python3

import sys
import serial
import time
from datetime import date

def checkCommands(argv):
    arduino = serial.Serial('COM3', 9600)
    counter = 0

    if (len(argv) != 2):
        raise Exception("not enough arguments")
    else:
        while True:
            if (argv[0] == "led"):
                if (argv[1] == "on"):
                    arduino.write('o'.encode())
                if (argv[1] == "off"):
                    arduino.write('f'.encode())
            if (argv[0] == "temperature"):
                logs = open('logs.txt', 'a')
                logs.write(str(date.today()) + arduino.readline().decode('utf-8'))
                logs.close()
            if (argv[0] == "humidity"):
                logs = open('logs.txt', 'a')
                logs.write(str(date.today()) + arduino.readline().decode('utf-8'))
                logs.close()
            if (counter > 5000):
                break
            counter += 1

def main(argv):
    try:
        checkCommands(argv)
    except Exception as e:
        print("Error : {}".format(e) , file=sys.stderr)
        sys.exit(84)

if (__name__ == "__main__"):
    main(sys.argv[1:])