import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MockedResponse } from 'src/app/models/mocked-response';
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
  fileIsValid: boolean = false;
  responses: MockedResponse[] | undefined;

  // Step 3
  responsesUploadingSubject = new Subject<boolean>();
  responsesUploading$ = this.responsesUploadingSubject.pipe(
    distinctUntilChanged()
  );
  uploadResultMessage: string | undefined;
  importSuccessful: boolean = false;
  errors: string[] = [];

  constructor(private apiService: ResponsesApiService) {}

  onSelect(event: any) {
    console.log(event);
    if (this.files.length > 0) {
      this.files = [];
    }
    this.files.push(...event.addedFiles);
    this.fileUploadStep.completed = true;
  }

  onRemove(_: File) {
    this.files = [];
    this.fileUploadStep.completed = false;
  }

  parseFile() {
    this.responses = [];
    let reader = new FileReader();

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

  uploadResponses() {
    this.responsesUploadingSubject.next(true);

    this.apiService.registerResponses(this.responses!).subscribe((r) => {
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

  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex == 1) {
      this.parseFile();
    }

    if (event.selectedIndex == 2) {
      this.uploadResponses();
      this.errors = [];
    }
  }

  close() {
    this.done.emit();
  }
}
