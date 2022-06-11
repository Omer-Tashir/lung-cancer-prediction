import { Component, OnInit } from '@angular/core';
import { LanguageService } from './core/language-service';
import { TextManager } from './core/text-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  textManager: any;
  selectedLanguage: 'he' | 'en' = 'en';

  constructor(
    private readonly languageService: LanguageService
  ) {}

  changeLanguage(language: 'he' | 'en') {
    this.languageService.setLanguage(language);
  }

  ngOnInit(): void {
    this.selectedLanguage = this.languageService.language;
    this.languageService.selectTextManager().subscribe(text => this.textManager = text);
  }
}
