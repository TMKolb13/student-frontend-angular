import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animation/fade-in.animation';


@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css'],
  animations: [fadeInAnimation]    
})
export class ClassFormComponent implements OnInit {

  classForm: NgForm;
  @ViewChild('classForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  class: object;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("class", +params['id']))
      .subscribe(classes => this.class = classes);
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

  saveClass(classes: NgForm){
    if(typeof classes.value.class_id === "number"){
      this.dataService.editRecord("class", classes.value, classes.value.class_id)
          .subscribe(
            classes => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("class", classes.value)
          .subscribe(
            classes => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.class = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.classForm = this.currentForm;
    this.classForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.classForm.form;

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
    'instructor_id': '',
    'subject': '',
    'course': ''
  };

  validationMessages = {
    'instructor_id': {
      'required': 'Instructor is required.'
    },
    'subject': {
      'required': 'Subject is required.'
    },
    'course': {
      'required': 'Course is required'
    }
  };

}
