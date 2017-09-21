import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
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

}
