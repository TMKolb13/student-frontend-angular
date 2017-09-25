import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animation/fade-in.animation';


@Component({
  selector: 'app-majorclass-form',
  templateUrl: './majorclass-form.component.html',
  styleUrls: ['./majorclass-form.component.css'],
  animations: [fadeInAnimation]    
})
export class MajorclassFormComponent implements OnInit {

  majorclassForm: NgForm;
  @ViewChild('majorclassForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  majorclass: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("majorclass", +params['id']))
      .subscribe(majorclass => this.majorclass = majorclass);
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

  saveMajorclass(majorclass: NgForm){
    if(typeof majorclass.value.major_class_id === "number"){
      this.dataService.editRecord("majorclass", majorclass.value, majorclass.value.major_class_id)
          .subscribe(
            majorclass => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("majorclass", majorclass.value)
          .subscribe(
            majorclass => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.majorclass = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.majorclassForm = this.currentForm;
    this.majorclassForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.majorclassForm.form;

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
    'major_id': '',
    'class_id': ''
  };

  validationMessages = {
    'major_id': {
      'required': 'Major ID is required.'
    },
    'class_id': {
      'required': 'Class ID is required.'
    }
  };

}
