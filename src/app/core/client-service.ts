import { Injectable } from "@angular/core";
import { ClientAppointment } from "../models/client-appointment.interface";
import { Client } from "../models/client.interface";
import { DatabaseService } from "../services/database.service";

import * as moment from 'moment/moment';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    constructor(
        private readonly db: DatabaseService
    ) { }

    register(): void {
        this.db.registerClient({
            uid: '204415608',
            email: 'omertashir1993@gmail.com',
            firstName: 'Omer',
            lastName: 'Tashir',
            sex: 'M',
            age: 29,
            phoneNumber: '0542880358',
            city: 'Holon',
            address: 'Israeli Ben Tzion',
            addressNumber: '7',
        } as Client);
    }

    addAppointment(client: Client): void {
        this.db.addClientAppointment({
            clientId: client.uid,
            date: moment('12.8.2021', 'DD-MM-YYYY').toString(),
            issue: 'Referral for blood tests',
            treatment: '',
        } as ClientAppointment);
    }
}