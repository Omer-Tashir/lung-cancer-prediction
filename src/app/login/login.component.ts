import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../core/language-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  textManager: any;

  constructor(
    private readonly authService: AuthService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.languageService.selectTextManager().subscribe(text => this.textManager = text);
  }

  login(loginData: any) {
    this.authService.login(loginData.email, loginData.password);
  }
}