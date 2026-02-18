import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PublicationService } from '../../services/publicationService/publication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { quillModules } from '../quill-config';

@Component({
  selector: 'app-admin-insert-publication',
  templateUrl: './admin-insert-publication.component.html',
  styleUrl: './admin-insert-publication.component.css'
})

export class AdminInsertPublicationComponent {

  /*
    ******************** Βasic initializations ********************
  */

  insertPublicationForm:FormGroup;
  isSubmitting = false;

  firstImageFile: File | null = null;
  additionalImageFiles: File[] = [];

  @ViewChild('firstImageInput') firstImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('additionalImagesInput') additionalImagesInput!: ElementRef<HTMLInputElement>;
  
  quillModules = quillModules;
  /*
    ******************** Constructor ********************
    1)inits
    2) init the form control
  */

  constructor(private publicationService:PublicationService,private fb:FormBuilder){

    this.insertPublicationForm = this.fb.group({
      type: [null,Validators.required],
      title: ['',Validators.required],
      content: ['',Validators.required],
      dateAndTime: [null, Validators.required],
      images: this.fb.group({
        firstImage: [null, Validators.required],
        additionalImages: [null]
      })
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      
      const sizePickerItems = document.querySelectorAll('.ql-picker.ql-size .ql-picker-item');
      sizePickerItems.forEach(item => {
        const value = item.getAttribute('data-value');
        if (value) {
          item.textContent = value;
        }
      });
    }, 100);
  }

  /*
    ******************** Submit the form ********************
    1) join first image with the rest (additional images)
    2) Call the api from service to add new publicity
    3) Handle the api response
  */

  submitPublication(){
    if(this.insertPublicationForm.valid){

      this.isSubmitting = true;

      const formValues = this.insertPublicationForm.value;
      const allImages: File[] = [this.firstImageFile!,...this.additionalImageFiles];

      this.publicationService.insertPublication(
        formValues.type,
        formValues.title,
        formValues.content,
        formValues.dateAndTime,
        allImages
      ).subscribe({
        next:(res) => {
          alert(res.message);
          this.insertPublicationForm.reset();
          
          this.firstImageFile = null;
          this.additionalImageFiles = [];

          this.firstImageInput.nativeElement.value = '';
          this.additionalImagesInput.nativeElement.value = '';
        },
        error: (err) => {
          alert(err.error?.error);
          this.insertPublicationForm.reset();
          
          this.firstImageFile = null;
          this.additionalImageFiles = [];

          this.firstImageInput.nativeElement.value = '';
          this.additionalImagesInput.nativeElement.value = '';
        },
        complete: () =>{
          this.isSubmitting = false;
          this.insertPublicationForm.reset();
          
          this.firstImageFile = null;
          this.additionalImageFiles = [];

          this.firstImageInput.nativeElement.value = '';
          this.additionalImagesInput.nativeElement.value = '';
        }
      })

    }
  }

  /*
    ******************** Form Validity ********************
  */

  formValidity(): boolean {
    return this.type!.invalid && this.type!.touched ||
           this.title!.invalid && this.title!.touched ||
           this.content!.invalid && this.content!.touched ||
           (this.firstImage!.invalid && this.firstImage!.touched) ||
           (this.dateAndTime!.invalid && this.dateAndTime!.touched)
  }

  /*
    ******************** Helper functions ********************
    1) Handle Images file Inputs
    2) Getters
  */

  // handle first image form input 
  onFirstImageSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const control = this.firstImage;

    if (element.files && element.files.length > 0) {
      this.firstImageFile = element.files[0];
      control?.setValue(this.firstImageFile);
    } else {
      this.firstImageFile = null;
      control?.setValue(null);
    }

    control?.markAsTouched();
    control?.updateValueAndValidity();
  }
  
  // handle additional image form input
  onAdditionalImagesSelected(event: Event): void {

    const element = event.target as HTMLInputElement;
    const control = this.additionalImages;

    if (element.files && element.files.length > 0) {

      this.additionalImageFiles = Array.from(element.files);
      control?.setValue(this.additionalImageFiles);

    } else {

      this.additionalImageFiles = [];
      control?.setValue(null);

    }
    
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  markFirstImageTouched() {
    const control = this.firstImage;
    
    if (control && !control.value) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  //getters

  get type(){
    return this.insertPublicationForm.get('type');
  }

  get title(){
    return this.insertPublicationForm.get('title');
  }

  get content(){
    return this.insertPublicationForm.get('content');
  }

  get dateAndTime(){
    return this.insertPublicationForm.get('dateAndTime');
  }

  get firstImage() {
    return this.insertPublicationForm.get('images.firstImage');
  }

  get additionalImages(){
    return this.insertPublicationForm.get('images.additionalImages');
  }
}