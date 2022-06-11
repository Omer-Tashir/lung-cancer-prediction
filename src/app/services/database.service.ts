import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

import { Doctor } from '../models/doctor.interface';
import { Client } from '../models/client.interface';
import { ClientAppointment } from '../models/client-appointment.interface';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {

    constructor(
        private db: AngularFirestore
    ) {}

    login(email: string): Observable<Doctor> {
        return this.db.collection(`doctor`, ref => ref.where('email', '==', email).limit(1)).get().pipe(
            first(),
            map(res => res.docs[0]),
            map(res => {
                const result = <Doctor>res.data();
                result.uid = res.id;
                return result;
            })
        );
    }

    getClient(uid: string): Observable<Client | undefined> {
        let localClient: Client | undefined;
        return this.db.collection(`client`).doc(''+uid).get().pipe(
            map(res => {
                if (res.data()) {
                    const result = <Client>res.data();
                    result.uid = res.id;
                    return result;
                }
                
                return undefined;
            }),
            tap(res => localClient = res),
            filter(client => !!client),
            switchMap(client => this.getClientAppointments(localClient?.uid)),
            map((appointments: ClientAppointment[]) => {
                if (localClient) {
                    localClient.medicalHistory = appointments;
                }
                return localClient;
            })
        );
    }

    getClientAppointments(clientId: string | undefined): Observable<ClientAppointment[]> {
        if (clientId) {
            return this.db.collection(`client-appointment`, ref => ref.where('clientId', '==', clientId)).get().pipe(
                first(),
                map(result => result.docs.map(doc => {
                    const result = <ClientAppointment>doc.data();
                    return result;
                })),
            );
        }

        return of([]);
    }

    registerClient(client: Client): Observable<void> {
        return from(this.db.collection(`client`).doc(client.uid).set(client));
    }

    addClientAppointment(appointment: ClientAppointment): Observable<any> {
        return from(this.db.collection(`client-appointment`).add(appointment));
    }
}