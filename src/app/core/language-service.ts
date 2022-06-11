import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from "rxjs";
import { TextManager } from "./text-manager";

@Injectable({
    providedIn: 'root',
})
export class LanguageService {

    private currentLanguage = new BehaviorSubject<'he'|'en'>('en');
    private currentDirection = new BehaviorSubject<'rtl'|'ltr'>('ltr');
    private textManager = new BehaviorSubject<any>(TextManager.en);

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        this.changeDomLanguage();
    }
    
    get language(): 'he' | 'en' {
        return this.currentLanguage.getValue();
    }

    get direction(): 'rtl' | 'ltr' {
        return this.currentDirection.getValue();
    }

    selectTextManager(): Observable<any> {
        return this.textManager.asObservable();
    }

    setLanguage(language: 'he' | 'en'): void {
        this.currentLanguage.next(language);
        this.textManager.next(language === 'he' ? TextManager.he : TextManager.en);
        this.setDirection(language === 'he' ? 'rtl' : 'ltr');
        this.changeDomLanguage();
    }

    private setDirection(dir: 'rtl' | 'ltr'): void {
        this.currentDirection.next(dir);
        this.changeDomLanguage();
    }

    private changeDomLanguage(): void {
        this.document.documentElement.lang = this.currentLanguage.getValue();
        this.document.body.dir = this.currentDirection.getValue();
    }
}