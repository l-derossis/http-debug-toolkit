import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Endpoint } from 'src/app/models/endpoint';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';

@Component({
  selector: 'app-endpoints-import',
  templateUrl: './endpoints-import.component.html',
  styleUrls: ['./endpoints-import.component.scss'],
})
export class EndpointsImportComponent {
  @ViewChild('fileUploadStep') fileUploadStep!: MatStep;
  @ViewChild('dataValidationStep') dataValidationStep!: MatStep;
  @Output() done = new EventEmitter();

  // Step 1
  files: File[] = [];
  fileLoadingSubject = new Subject<boolean>();
  fileLoading$ = this.fileLoadingSubject.pipe(distinctUntilChanged());

  // Step 2
  fileIsValid = false;
  endpoints: Endpoint[] | undefined;

  // Step 3
  endpointsUploadingSubject = new Subject<boolean>();
  endpointsUploading$ = this.endpointsUploadingSubject.pipe(
    distinctUntilChanged()
  );
  uploadResultMessage: string | undefined;
  importSuccessful = false;
  errors: string[] = [];

  constructor(private apiService: EndpointsApiService) {}

  onSelect(event: any): void {
    console.log(event);
    if (this.files.length > 0) {
      this.files = [];
    }
    this.files.push(...event.addedFiles);
    this.fileUploadStep.completed = true;
  }

  clearFiles(): void {
    this.files = [];
    this.fileUploadStep.completed = false;
  }

  parseFile(): void {
    this.endpoints = [];
    const reader = new FileReader();

    this.fileLoadingSubject.next(true);

    reader.onload = (data) => {
      const value = data.target?.result;
      if (!value) {
        return;
      }

      try {
        this.endpoints = JSON.parse(value.toString());
        this.fileIsValid = true;
      } catch (error) {
        this.fileIsValid = false;
      }

      this.fileLoadingSubject.next(false);
    };

    reader.readAsText(this.files[0]);
  }

  uploadEndpoints(): void {
    this.endpointsUploadingSubject.next(true);

    this.apiService.registerEndpoints(this.endpoints ?? []).subscribe((r) => {
      this.uploadResultMessage = r.message;
      if (r.errors.length == 0) {
        this.importSuccessful = true;
        this.fileUploadStep.editable = false;
        this.fileUploadStep.completed = true;
        this.dataValidationStep.editable = false;
        this.dataValidationStep.completed = true;
      } else {
        r.errors.forEach((error: any) => {
          const message = `[${error.method} ${error.route}] ${error.message}`;
          this.errors.push(message);
        });
      }

      this.endpointsUploadingSubject.next(false);
    });
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex == 1) {
      this.parseFile();
    }

    if (event.selectedIndex == 2) {
      this.uploadEndpoints();
      this.errors = [];
    }
  }

  close(): void {
    this.done.emit();
  }
}
