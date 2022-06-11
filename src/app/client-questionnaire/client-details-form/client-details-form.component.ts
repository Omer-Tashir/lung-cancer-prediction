import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Client } from 'src/app/models/client.interface';
import { Doctor } from '../../models/doctor.interface';

@Component({
  selector: 'app-client-details-form',
  templateUrl: './client-details-form.component.html',
  styleUrls: ['./client-details-form.component.scss']
})
export class ClientDetailsFormComponent implements OnInit {

  @Input() rtl: boolean = false;

  @Input() textManager: any;

  @Input() loggedInUser!: Doctor;

  @Input() client!: Client;

  @Input() disabled: boolean = false;

  @Output() back: EventEmitter<void> = new EventEmitter();

  @Output() continue: EventEmitter<void> = new EventEmitter();

  @Output() reset: EventEmitter<void> = new EventEmitter();

  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clientId: [{ value: this.client?.uid, disabled: true }],
      firstName: [{ value: this.client?.firstName, disabled: true }],
      lastName: [{ value: this.client?.lastName, disabled: true }],
      sex: [{ value: this.client?.sex, disabled: true }],
      age: [{ value: this.client?.age, disabled: true }],
      address: [{ value: `${this.client?.address} ${this.client?.addressNumber}, ${this.client?.city}`, disabled: true }],
      medicalHistory: [{ value: this.client?.medicalHistory, disabled: true }]
    });
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