#!/usr/bin/python3

import sys
import serial
import time

def checkCommands(argv):
    arduino = serial.Serial('COM3', 9600)

    if (len(argv) != 2):
        raise Exception("not enough arguments")
    else:
        while True:
            if (argv[0] == "led"):
                if (argv[1] == "on"):
                    print('Led turned on!')
                    sys.stdout.flush()
                    arduino.write('1'.encode())
                if (argv[1] == "off"):
                    arduino.write('0'.encode())
                    print('Led turned off!')
                    sys.stdout.flush()
            if (argv[0] == "temperature"):
                logs = open('logs.txt', 'a')
                logs.write(arduino.readline())
                logs.close()
            if (argv[0] == "humidity"):
                logs = open('logs.txt', 'a')
                logs.write(arduino.readline())
                logs.close()
            time.sleep(10)

def main(argv):
    try:
        checkCommands(argv)
    except Exception as e:
        print("Error : {}".format(e) , file=sys.stderr)
        sys.exit(84)

if (__name__ == "__main__"):
    main(sys.argv[1:])