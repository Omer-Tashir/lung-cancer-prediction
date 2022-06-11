import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Doctor } from '../models/doctor.interface';
import { Client } from '../models/client.interface';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../core/client-service';
import { LanguageService } from '../core/language-service';
import { DatabaseService } from '../services/database.service';
import { finalize, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-client-questionnaire',
  templateUrl: './client-questionnaire.component.html',
  styleUrls: ['./client-questionnaire.component.scss']
})
export class ClientQuestionnaireComponent implements OnInit {

  step: number = 0;
  disabled = false;
  textManager: any;
  loggedInUser!: Doctor | undefined;
  client!: Client | undefined;

  constructor(
    private fb: FormBuilder,
    private readonly db: DatabaseService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly languageService: LanguageService,
  ) { }

  getCurrentStep(): void {
    const sessionClient = sessionStorage.getItem('client');
    if (sessionClient) {
      this.client = JSON.parse(sessionClient);
      this.step = 1;

      console.log(this.client);
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
          this.step = 1;
        }
        else {
          alert(this.textManager['GET_CLIENT_client_not_found']);
        }
      }),
      finalize(() => this.disabled = false)
    ).subscribe();
  }

  reset(): void {
    this.step = 0;
    sessionStorage.removeItem('client');
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.languageService.selectTextManager().subscribe(text => this.textManager = text);

    this.getCurrentStep();
  }
}
