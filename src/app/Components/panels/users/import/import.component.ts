import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators'; 
import { HttpEventType, HttpErrorResponse } from '@angular/common/http'; 

import { UsersService } from '../../../../services/users/users.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})

export class ImportComponent implements OnInit {

	@ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];  
    constructor(private uploadService: UsersService) { }
    
    private uploadFiles() {  
	    this.fileUpload.nativeElement.value = '';  
	    this.files.forEach(file => {  
	      this.uploadFile(file);  
	    });  
	}

    ngOnInit() {}

    onClick() {  
	    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {  
		    for (let index = 0; index < fileUpload.files.length; index++) {  
			     const file = fileUpload.files[index];  
			     this.files.push({ data: file, inProgress: false, progress: 0});  
		    }  
	      	this.uploadFiles();  
	    };  
	    fileUpload.click();  
	}

    uploadFile(file) {  
	    const formData = new FormData();  
	    formData.append('csvfile', file.data);  
	    file.inProgress = true;
	    console.log(file.data)
	    this.uploadService.import(formData).pipe(  
	      map(event => {  
	        switch (event.type) {  
	          case HttpEventType.UploadProgress:  
	            file.progress = Math.round(event.loaded * 100 / event.total);  
	            break;  
	          case HttpEventType.Response:  
	            return event;  
	        }  
	      }),  
	      catchError((error: HttpErrorResponse) => {  
	        file.inProgress = false;  
	        return of(`${file.data.name} upload failed.`);  
	      })).subscribe((event: any) => {  
	        if (typeof (event) === 'object') {  
	          console.log(event.body);  
	        }  
	      });  
	  }
}