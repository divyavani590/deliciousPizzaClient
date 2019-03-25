import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class AlexaVoiceService {
    private url = 'http://ec2-52-54-227-251.compute-1.amazonaws.com:3000';
    private socket;

    sendMessage(message) {
        this.socket.emit('add-message', message);
    }

    getMessages() {
        let observable = new Observable(observer => {
            this.socket = io.connect(this.url);
            this.socket.on('message', (data) => {
                observer.next(data);
            });
            this.socket.on('alexaMessage', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}