import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.interface';
import { Doctor } from '../../models/doctor.interface';

@Component({
  selector: 'app-client-question-form-result',
  templateUrl: './client-question-form-result.component.html',
  styleUrls: ['./client-question-form-result.component.scss']
})
export class ClientQuestionFormResultComponent implements OnInit {
  
  @Input() rtl: boolean = false;

  @Input() textManager: any;

  @Input() loggedInUser!: Doctor;

  @Input() client!: Client;

  @Input() disabled: boolean = false;

  @Input() form!: FormGroup;

  @Input() precentege: number = 0;

  @Output() back: EventEmitter<void> = new EventEmitter();

  @Output() continue: EventEmitter<void> = new EventEmitter();

  @Output() reset: EventEmitter<void> = new EventEmitter();


  constructor( 
  ) {}

  ngOnInit(): void {
  }

  onBack() {
    this.back.emit();
  }

  onSubmit() {
    this.continue.emit();
  }

  onReset() {
    this.reset.emit();
  }
}