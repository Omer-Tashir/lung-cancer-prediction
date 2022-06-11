import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { finalize, first, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Doctor } from '../models/doctor.interface';
import { Client } from '../models/client.interface';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../core/client-service';
import { LanguageService } from '../core/language-service';
import { DatabaseService } from '../services/database.service';
import { StepEnum } from '../models/step.enum';

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

  constructor(
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

  setStep(step: StepEnum) {
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
    sessionStorage.removeItem('clientHealthCheckForm');
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
      hasCooling: new FormControl(sessionData?.hasCooling ?? false),
      hasCough: new FormControl(sessionData?.hasCough ?? false),
      hasChronicDiseases: new FormControl(sessionData?.hasChronicDiseases ?? false),
      hasAsthma: new FormControl(sessionData?.hasAsthma ?? false),
      smoking: new FormControl(sessionData?.smoking ?? ''),
      smokingYears: new FormControl(sessionData?.smokingYears ?? 0),
      smokingAmountPerDay: new FormControl(sessionData?.smoking ?? 0),
      asbestos: new FormControl(sessionData?.asbestos ?? false),
      alcohol: new FormControl(sessionData?.alcohol ?? false),
      anxiety: new FormControl(sessionData?.anxiety ?? false),
    });

    this.clientHealthCheckForm.valueChanges.pipe(
      tap(value => sessionStorage.setItem('clientHealthCheckForm', JSON.stringify(value)))
    ).subscribe();
  }
}
