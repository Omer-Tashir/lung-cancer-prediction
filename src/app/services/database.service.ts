import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Doctor } from '../models/doctor.interface';

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
            map(res => Object.assign(new Doctor(), res))
        );
    }
}