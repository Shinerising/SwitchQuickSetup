import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

declare interface SerialCommanderOption {
    port: string;
    baudrate: number;
    readDelimiter: string;
    writeDelimiter: string;
    disableLog: boolean;
    defaultDelay: number;
    log: (text:string | string[]) => void;
}

export class SerialCommander {
    private port: SerialPort;
    private log: (text:string | string[]) => void;
    private isLogEnabled: boolean;
    private defaultDelay: number;
    private fallbackSerialDataHandler: (data:string) => void;
    private serialDataHandler: (data:string) => void;
    private writeDelimiter: string;
    private parser: ReadlineParser;
    constructor(option: SerialCommanderOption) {
        this.log = option.log;
        this.isLogEnabled = !option.disableLog
        this.defaultDelay = option.defaultDelay
        this.fallbackSerialDataHandler = (line: string) => this.log(`{answer given outside command scope} ${line}`)
        this.serialDataHandler = this.fallbackSerialDataHandler
        this.writeDelimiter = option.writeDelimiter

        this.port = new SerialPort({ path: option.port, baudRate: option.baudrate })
        this.parser = new ReadlineParser({ delimiter: option.readDelimiter })
        this.port.pipe(this.parser)
        this.parser.on('data', (line: string) => this.serialDataHandler(line))
    }

    async send(command: string, {
        expectedResponses = ['OK'],
        timeout = 1000,
        delay = this.defaultDelay
    } = {}) {
        await new Promise(resolve => setTimeout(resolve, delay))

        const startTime = new Date().getTime()
        let response = ''

        return new Promise((resolve, reject) => {
            const errorTimeout = setTimeout(() => {
                this.serialDataHandler = this.fallbackSerialDataHandler
                reject(new Error('Request timed out before a satisfactory answer was given'))
            }, timeout)

            const escapedCommand = `${command}${this.writeDelimiter}`
            this.port.write(escapedCommand)
            if (this.isLogEnabled) this.log(`>> ${command}`)

            this.serialDataHandler = (line: string | string[]) => {
                response += line

                const isCommandSuccessfullyTerminated = expectedResponses.some(
                    expectedResponse => line.includes(expectedResponse)
                )
                if (isCommandSuccessfullyTerminated) {
                    if (this.isLogEnabled) this.log(`<< ${line}`)

                    this.serialDataHandler = this.fallbackSerialDataHandler
                    clearTimeout(errorTimeout)

                    const endTime = new Date().getTime()

                    resolve({
                        command,
                        startTime,
                        endTime,
                        executionTime: endTime - startTime,
                        response
                    })
                } else {
                    if (this.isLogEnabled) this.log(line)
                }
            }
        })
    }

    close() {
        if (this.port.isOpen) this.port.close();
    }
}