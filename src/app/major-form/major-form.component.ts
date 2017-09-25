import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-major-form',
  templateUrl: './major-form.component.html',
  styleUrls: ['./major-form.component.css']
})
export class MajorFormComponent implements OnInit {

  majorForm: NgForm;
  @ViewChild('majorForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  majorData: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("major", +params['id']))
      .subscribe(majorData => this.majorData = majorData);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });

  }

  saveMajor(majorData: NgForm){
    if(typeof majorData.value.major_id === "number"){
      this.dataService.editRecord("major", majorData.value, majorData.value.major_id)
          .subscribe(
            major => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("major", majorData.value)
          .subscribe(
            majorData => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.majorData = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.majorForm = this.currentForm;
    this.majorForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.majorForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'major': '',
    'sat': ''
  };

  validationMessages = {
    'major': {
      'required': 'Major is required.',
      'minlength': 'Major must be at least 2 characters long.',
      'maxlength': 'Major cannot be more than 30 characters long.'
    },
    'sat': {
      'required': 'SAT is required.',
      'maxlength': 'Sat cannot be more than 4 characters long.'
    }
  };

}
