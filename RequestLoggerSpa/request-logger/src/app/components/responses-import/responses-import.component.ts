import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Endpoint } from 'src/app/models/endpoint';
import { ResponsesApiService } from 'src/app/services/responses-api.service';

@Component({
  selector: 'app-responses-import',
  templateUrl: './responses-import.component.html',
  styleUrls: ['./responses-import.component.scss'],
})
export class ResponsesImportComponent {
  @ViewChild('fileUploadStep') fileUploadStep!: MatStep;
  @ViewChild('dataValidationStep') dataValidationStep!: MatStep;
  @Output() done = new EventEmitter();

  // Step 1
  files: File[] = [];
  fileLoadingSubject = new Subject<boolean>();
  fileLoading$ = this.fileLoadingSubject.pipe(distinctUntilChanged());

  // Step 2
  fileIsValid = false;
  responses: Endpoint[] | undefined;

  // Step 3
  responsesUploadingSubject = new Subject<boolean>();
  responsesUploading$ = this.responsesUploadingSubject.pipe(
    distinctUntilChanged()
  );
  uploadResultMessage: string | undefined;
  importSuccessful = false;
  errors: string[] = [];

  constructor(private apiService: ResponsesApiService) {}

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
    this.responses = [];
    const reader = new FileReader();

    this.fileLoadingSubject.next(true);

    reader.onload = (data) => {
      const value = data.target?.result;
      if (!value) {
        return;
      }

      try {
        this.responses = JSON.parse(value.toString());
        this.fileIsValid = true;
      } catch (error) {
        this.fileIsValid = false;
      }

      this.fileLoadingSubject.next(false);
    };

    reader.readAsText(this.files[0]);
  }

  uploadResponses(): void {
    this.responsesUploadingSubject.next(true);

    this.apiService.registerResponses(this.responses ?? []).subscribe((r) => {
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

      this.responsesUploadingSubject.next(false);
    });
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex == 1) {
      this.parseFile();
    }

    if (event.selectedIndex == 2) {
      this.uploadResponses();
      this.errors = [];
    }
  }

  close(): void {
    this.done.emit();
  }
}
