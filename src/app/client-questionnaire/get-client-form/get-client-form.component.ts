import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doctor } from '../../models/doctor.interface';

@Component({
  selector: 'app-get-client-form',
  templateUrl: './get-client-form.component.html',
  styleUrls: ['./get-client-form.component.scss']
})
export class GetClientFormComponent implements OnInit {

  @Input() rtl: boolean = false;

  @Input() textManager: any;

  @Input() loggedInUser!: Doctor;

  @Input() disabled: boolean = false;

  @Output() formData: EventEmitter<{
    clientId: string;
  }> = new EventEmitter();

  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
    });
  }

  get clientId() {
    return this.form.get('clientId');
  }

  onSubmit() {
    this.formData.emit(this.form.value);
  }
}
