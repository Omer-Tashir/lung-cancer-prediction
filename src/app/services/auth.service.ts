import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { LanguageService } from '../core/language-service';
import { DatabaseService } from './database.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    textManager: any;
    
    constructor(
        private readonly languageService: LanguageService,
        private readonly db: DatabaseService,
        private readonly afAuth: AngularFireAuth,
        private readonly router: Router
    ) {
        this.languageService.selectTextManager().subscribe(text => this.textManager = text);
    }

    login(email: string, password: string) {
        of(this.afAuth.signOut()).pipe(
            switchMap(() => of(this.afAuth.signInWithEmailAndPassword(email, password))),
            tap(res => {
                if (!res) {
                    alert(this.textManager.AUTH_wrong_credentials);
                }
            }),
            filter(res => !!res),
            switchMap(() => this.db.login(email)),
            tap(res => sessionStorage.setItem('logged_in_user', JSON.stringify(res)))
        ).subscribe();
    }

    logout(error?: HttpErrorResponse | undefined) {
        if (error != undefined) {
            alert(error);
        }

        this.afAuth.signOut().then(() => {
            sessionStorage.clear();
            this.router.navigate(['login']);
        });
    }
}