import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarouselService } from '../../services/carouselService/carousel.service';

@Component({
  selector: 'app-admin-edit-carousel',
  templateUrl: './admin-edit-carousel.component.html',
  styleUrl: './admin-edit-carousel.component.css'
})
export class AdminEditCarouselComponent {

  selectedFiles: File[] = [];
  carouselForm: FormGroup;
  isSubmitting = false;
  imageFiles: File[] = [];

  constructor(private fb: FormBuilder,private carouselService:CarouselService){

    this.carouselForm = this.fb.group({
      image1: [null,Validators.required],
      image2: [null,Validators.required],
      image3: [null,Validators.required],
      image4: [null,Validators.required]
    })
  }

  submitImages(){
    if(this.carouselForm.valid){

      this.isSubmitting = true;

      this.imageFiles = this.selectedFiles.filter((file) => !!file);

      this.carouselService.updateCarouselImages(this.imageFiles).subscribe({
        next:(res) => {
          alert(res.message);
          this.resetForm();
        },
        error: (err) => {
          alert(err.error?.error);
          this.resetForm();
        },
        complete: () => {
          this.isSubmitting = false;
          this.resetForm();
        }
      })
    }
  }
  
  // handle first image form input 
  onImageSelected(event: Event, index: number): void {
    const element = event.target as HTMLInputElement;

    if (element.files && element.files.length > 0) {
      // Store the selected file in the corresponding index
      this.selectedFiles[index - 1] = element.files[0];

      // Update the corresponding form control value
      this.carouselForm.controls[`image${index}`].setValue(element.files[0]);

      // Mark the control as touched and validate
      this.carouselForm.controls[`image${index}`].markAsTouched();
      this.carouselForm.controls[`image${index}`].updateValueAndValidity();
    } else {
      // Clear the selected file if no file is chosen
      this.selectedFiles[index - 1] = null!;
      this.carouselForm.controls[`image${index}`].setValue(null);
    }
  }


  formValidity(): boolean{
    return (this.image1!.invalid && this.image1!.touched) ||
            (this.image2!.invalid && this.image2!.touched) ||
            (this.image3!.invalid && this.image3!.touched) ||
            (this.image4!.invalid && this.image4!.touched);
  }

  resetForm(): void {
    // Reset the form controls
    this.carouselForm.reset();
  
    // Clear the selected files array
    this.selectedFiles = [];
    this.imageFiles = [];
  
    // Clear the file input elements
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
  
    // Mark all form controls as pristine and untouched
    Object.keys(this.carouselForm.controls).forEach((key) => {
      const control = this.carouselForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });
  
    this.isSubmitting = false; // Ensure submit state is cleared
  }
  

  get image1(){
    return this.carouselForm.get('image1');
  }

  get image2(){
    return this.carouselForm.get('image2');
  }

  get image3(){
    return this.carouselForm.get('image3');
  }

  get image4(){
    return this.carouselForm.get('image4');
  }
}
