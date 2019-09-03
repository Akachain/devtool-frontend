

import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

export class SocketService {

    private url = 'https://devtool.akachain.io';
    private socket;

    constructor() {
        this.socket = io(this.url, {
            extraHeaders: {
                'Access-Control-Allow-Credentials': 'omit'
            }
        });
    }

    public getStatusInstall = () => {
        return Observable.create((observer) => {
            this.socket.on('insl_cc', (message) => {
                observer.next(message);
            });
        });
    }

    public getStatusUpgrade = () => {
        return Observable.create((observer) => {
            this.socket.on('upg_cc', (message) => {
                observer.next(message);
            });
        });
    }

    public getStatusInit = () => {
        return Observable.create((observer) => {
            this.socket.on('init_cc', (message) => {
                observer.next(message);
            });
        });
    }
}
