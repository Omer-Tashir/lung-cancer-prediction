import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, first, map, pluck, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Doctor } from '../models/doctor.interface';
import { Client } from '../models/client.interface';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../core/client-service';
import { LanguageService } from '../core/language-service';
import { DatabaseService } from '../services/database.service';
import { StepEnum } from '../models/step.enum';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-client-questionnaire',
  templateUrl: './client-questionnaire.component.html',
  styleUrls: ['./client-questionnaire.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
          animate("0.2s ease-in", keyframes([
            style({ transform: `translateX(10%)`, opacity: .5 }),
            style({ transform: `translateX(5%)`, opacity: .65 }),
            style({ transform: `translateX(0%)`, opacity: .8 }),
            style({ transform: `translateX(0%)`, opacity: 1 }),
          ])),
      ]),
    ])
  ]
})
export class ClientQuestionnaireComponent implements OnInit {

  StepEnum = StepEnum;
  step: StepEnum = StepEnum.GET_CLIENT_ID;
  rtl = false;
  disabled = false;
  textManager: any;
  loggedInUser!: Doctor | undefined;
  client!: Client | undefined;
  clientHealthCheckForm!: FormGroup;
  precentege: number = 0;

  constructor(
    private readonly route: Router,
    private readonly http: HttpClient,
    private readonly db: DatabaseService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly languageService: LanguageService,
  ) { }

  getCurrentStep(): void {
    const sessionClient = sessionStorage.getItem('client');
    const sessionStep = sessionStorage.getItem('step');

    if (sessionClient) {
      this.client = JSON.parse(sessionClient);
    }

    if (sessionStep) {
      this.setStep(JSON.parse(sessionStep));
    }
    else if (sessionClient) {
      this.setStep(StepEnum.APPROVE_CLIENT_PRESONAL_DETAILS);
    }
    else {
      this.setStep(StepEnum.GET_CLIENT_ID);
    }
  }

  searchClient(formData: any): void {
    this.disabled = true;
    this.db.getClient(formData.clientId).pipe(
      first(),
      tap(client => {
        if (client) {
          sessionStorage.setItem('client', JSON.stringify(client));
          this.client = client;
          this.setStep(StepEnum.APPROVE_CLIENT_PRESONAL_DETAILS);
        }
        else {
          alert(this.textManager['GET_CLIENT_client_not_found']);
        }
      }),
      finalize(() => this.disabled = false)
    ).subscribe();
  }

  checkStep1(): void {
    this.disabled = true;

    // http call to check probability for a follow-up questionnaire
    this.http.get(
      `http://127.0.0.1:5000/form1Probabillity?AGE=${this.client?.age}
      &CITY=${this.client?.city}
      &PASSIVE_SMOKING=${this.clientHealthCheckForm.get('PASSIVE_SMOKING')?.value}
      &SADNESS=${this.clientHealthCheckForm.get('SADNESS')?.value}
      &COUGHING=${this.clientHealthCheckForm.get('COUGHING')?.value}
      &PHYSICHAL_ACTIVITY_DIFFICULTY=${this.clientHealthCheckForm.get('PHYSICHAL_ACTIVITY_DIFFICULTY')?.value}
      &RICKETY_BONES=${this.clientHealthCheckForm.get('RICKETY_BONES')?.value}`
    ).pipe(
      first(),
      pluck('response'),
      map(response => Number(response) > 0.3),
      tap(result => {
        if (result) {
          this.setStep(StepEnum.CLIENT_QUESTIONNAIRE_2);
        }
        else {
          alert(this.textManager['CLIENT_QUESTION_FORM1_not_enough_chances']);
        }
      }),
      catchError(error => {
        console.log(error);
        alert(this.textManager['CLIENT_QUESTION_FORM_failed']);
        return EMPTY;
      })
    ).subscribe(() => this.disabled = false);
  }

  checkStep2(): void {
    this.disabled = true;

    // http call to check probability for a follow-up questionnaire
    this.http.get(
      `http://127.0.0.1:5000/form2Probabillity?AGE=${this.client?.age}
      &CITY=${this.client?.city}
      &PASSIVE_SMOKING=${this.clientHealthCheckForm.get('PASSIVE_SMOKING')?.value}
      &SADNESS=${this.clientHealthCheckForm.get('SADNESS')?.value}
      &COUGHING=${this.clientHealthCheckForm.get('COUGHING')?.value}
      &PHYSICHAL_ACTIVITY_DIFFICULTY=${this.clientHealthCheckForm.get('PHYSICHAL_ACTIVITY_DIFFICULTY')?.value}
      &RICKETY_BONES=${this.clientHealthCheckForm.get('RICKETY_BONES')?.value}
      &LOST=${this.clientHealthCheckForm.get('LOST')?.value}
      &MARITAL_STATUS=${this.clientHealthCheckForm.get('MARITAL_STATUS')?.value}
      &BASEMENT=${this.clientHealthCheckForm.get('BASEMENT')?.value}
      &FAMILY_CANCER_HISTORY=${this.clientHealthCheckForm.get('FAMILY_CANCER_HISTORY')?.value}
      &SMOKING=${this.clientHealthCheckForm.get('SMOKING')?.value}
      &PHYSICHAL_ACTIVITY=${this.clientHealthCheckForm.get('PHYSICHAL_ACTIVITY')?.value}
      &HAPINESS=${this.clientHealthCheckForm.get('HAPINESS')?.value}`
    ).pipe(
      first(),
      pluck('response'),
      tap(result => {
          this.precentege = Number(result);
          sessionStorage.setItem('precentege', JSON.stringify(this.precentege));
          this.setStep(StepEnum.CLIENT_QUESTIONNAIRE_RESULT);
      }),
      catchError(error => {
        console.log(error);
        alert(this.textManager['CLIENT_QUESTION_FORM_failed']);
        return EMPTY;
      })
    ).subscribe(() => this.disabled = false);
  }

  setStep(step: StepEnum): void {
    if (step === StepEnum.GET_CLIENT_ID) {
      this.removeSessionData();
    }

    this.step = step;
    sessionStorage.setItem('step', JSON.stringify(step));
  }

  reset(): void {
    this.setStep(StepEnum.GET_CLIENT_ID);
    this.removeSessionData();
  }

  private removeSessionData(): void {
    this.client = undefined;
    this.clientHealthCheckForm?.reset();
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('precentege');
    sessionStorage.removeItem('clientHealthCheckForm');
  }

  goToReports(): void {
    this.route.navigate(['reports']);
  }

  get disabledClientQuestionForm1(): boolean {
    return this.clientHealthCheckForm.controls['PHYSICHAL_ACTIVITY_DIFFICULTY'].invalid ||
      this.clientHealthCheckForm.controls['RICKETY_BONES'].invalid ||
      this.clientHealthCheckForm.controls['COUGHING'].invalid ||
      this.clientHealthCheckForm.controls['SADNESS'].invalid ||
      this.clientHealthCheckForm.controls['PASSIVE_SMOKING'].invalid
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.languageService.selectTextManager().subscribe(text => this.textManager = text);
    this.languageService.selectDirection().subscribe(dir => this.rtl = dir === 'rtl');
    this.getCurrentStep();

    const sessionClientHealthCheckForm: any = sessionStorage.getItem('clientHealthCheckForm');
    let sessionData;

    if (sessionClientHealthCheckForm) {
      sessionData = JSON.parse(sessionClientHealthCheckForm);
    }

    this.clientHealthCheckForm = new FormGroup({
      // STEP 1
      PHYSICHAL_ACTIVITY_DIFFICULTY: new FormControl(sessionData?.PHYSICHAL_ACTIVITY_DIFFICULTY ?? null, Validators.required),
      RICKETY_BONES: new FormControl(sessionData?.RICKETY_BONES ?? null, Validators.required),
      COUGHING: new FormControl(sessionData?.COUGHING ?? null, Validators.required),
      SADNESS: new FormControl(sessionData?.SADNESS ?? null, Validators.required),
      PASSIVE_SMOKING: new FormControl(sessionData?.PASSIVE_SMOKING ?? null, Validators.required),

      // STEP 2
      LOST: new FormControl(sessionData?.LOST ?? 0),
      MARITAL_STATUS: new FormControl(sessionData?.MARITAL_STATUS ?? 0),
      BASEMENT: new FormControl(sessionData?.BASEMENT ?? false),
      FAMILY_CANCER_HISTORY: new FormControl(sessionData?.FAMILY_CANCER_HISTORY ?? false),
      SMOKING: new FormControl(sessionData?.SMOKING ?? false),
      PHYSICHAL_ACTIVITY: new FormControl(sessionData?.PHYSICHAL_ACTIVITY ?? false),
      HAPINESS: new FormControl(sessionData?.HAPINESS ?? false),
    });

    this.clientHealthCheckForm.valueChanges.pipe(
      tap(value => sessionStorage.setItem('clientHealthCheckForm', JSON.stringify(value)))
    ).subscribe();

    this.precentege = sessionStorage.getItem('precentege') ? Number(sessionStorage.getItem('precentege')) : 0;
  }
}
