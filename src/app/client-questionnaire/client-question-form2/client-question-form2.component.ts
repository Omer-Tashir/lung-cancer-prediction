import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Client } from 'src/app/models/client.interface';
import { Doctor } from '../../models/doctor.interface';

@Component({
  selector: 'app-client-question-form2',
  templateUrl: './client-question-form2.component.html',
  styleUrls: ['./client-question-form2.component.scss']
})
export class ClientQuestionForm2Component {

  @Input() textManager: any;

  @Input() loggedInUser!: Doctor;

  @Input() client!: Client;

  @Input() disabled: boolean = false;

  @Input() form!: FormGroup;

  @Output() back: EventEmitter<void> = new EventEmitter();

  @Output() continue: EventEmitter<void> = new EventEmitter();

  @Output() reset: EventEmitter<void> = new EventEmitter();

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