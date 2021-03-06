import { Component, OnInit,Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'
import { fadeInAnimation } from '../animation/fade-in.animation';


@Component({
  selector: 'app-studentclass',
  templateUrl: './studentclass.component.html',
  styleUrls: ['./studentclass.component.css'],
  animations: [fadeInAnimation]      
})
export class StudentclassComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  studentclasses: any[];
  mode = 'Observable';
 
  constructor (private dataService: DataService, public dialog: MdDialog) {}
 
  ngOnInit() { this.getStudentclasses(); }
 
  getStudentclasses() {
    this.dataService.getRecords("studentclass")
      .subscribe(
        studentclasses => this.studentclasses = studentclasses,
        error =>  this.errorMessage = <any>error);
  }

  deleteStudentclasses(id:number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dataService.deleteRecord("studentclass", id)
          .subscribe(
            studentclass => {this.successMessage = "Record(s) deleted successfully"; this.getStudentclasses(); },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

}
