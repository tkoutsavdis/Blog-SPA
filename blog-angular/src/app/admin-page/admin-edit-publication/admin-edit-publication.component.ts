import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from '../../services/publicationService/publication.service';
import { globalTitles } from '../../models/globalTitles';
import { Publication } from '../../models/publication';
import { quillModules } from '../quill-config';
import Quill from 'quill';
@Component({
  selector: 'app-admin-edit-publication',
  templateUrl: './admin-edit-publication.component.html',
  styleUrl: './admin-edit-publication.component.css'
})
export class AdminEditPublicationComponent {

  /*
    ******************* Basic Imports *******************
  */
 
  editPublicationForm: FormGroup;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  titlesList!: globalTitles[];
  filteredTitlesList!: globalTitles[];

  publicationElement!: Publication | null;

  publicationImages: string[] = [];

  firstImageFile: File | null = null;
  additionalImageFiles: File[] = [];
  isSubmitting = false;

  @ViewChild('firstImageInput') firstImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('additionalImagesInput') additionalImagesInput!: ElementRef<HTMLInputElement>;

  quillModules = quillModules;
  
  /*
    ******************* Constructor *******************
    
  */
 
  constructor(private fb:FormBuilder,private publicationService:PublicationService){

    this.editPublicationForm = this.fb.group({
      selectType: [null, Validators.required],
      selectTitle: [{value: '', disabled:true}, Validators.required],
      type: [null, Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      dateAndTime: [null, Validators.required],
      images: this.fb.group({
        firstImage: [null],
        additionalImages: [null]
      })
    });
  }

  /*
    ******************* On Init *******************
    1) Get the list of titles (all names) to search by. 
    2) Get speciffic publication info by title (call the api)
  */
 
  ngOnInit(){

    this.getPublicationType();
    
    this.selectTitle!.valueChanges.subscribe((selectedTitle)=>{
      if(selectedTitle){
        this.getPublication(selectedTitle);
      }else{
        this.publicationElement = null;
        this.publicationImages = [];
      }
    });
  }

  handleEditorCreated(editor: Quill): void {
    // Use a short timeout to ensure the toolbar is fully rendered
    setTimeout(() => {
      // Update the dropdown items to display the actual pixel values
      const sizePickerItems = document.querySelectorAll('.ql-picker.ql-size .ql-picker-item');
      sizePickerItems.forEach(item => {
        const value = item.getAttribute('data-value');
        if (value) {
          item.textContent = value;
        }
      });
    }, 100);
  }

  getPublicationType(){
    this.selectType!.valueChanges.subscribe((selectedType) =>{
      if(selectedType){
        this.selectTitle!.enable();
        this.selectTitle!.setValue('');
        this.getPublicationTitles(selectedType);
      }else{
        this.selectTitle!.disable();
        this.selectTitle!.setValue('');
        this.titlesList = [];
        this.filteredTitlesList = [];
      }
    });
  }

  // get the list of titles
  getPublicationTitles(type:string){
    this.publicationService.getTitles(type).subscribe((titles)=>{
      this.titlesList = titles;
      this.filteredTitlesList = titles;
    });

    this.editPublicationForm.updateValueAndValidity;
  }

  getPublication(title:string){

    this.publicationService.getPublicationByTitle(title).subscribe((publication)=> {

      this.publicationElement = publication;

      this.publicationImages = [...this.publicationElement.images];

      const formattedDateAndTime = this.publicationElement.dateAndTime.slice(0, 16);
      
      this.editPublicationForm.patchValue({
        type:this.publicationElement.type,
        title:this.publicationElement.title,
        content: this.publicationElement.content,
        dateAndTime:formattedDateAndTime
      });

      this.editPublicationForm.addValidators(() => 
        this.atLeastOneImageValidator()
      );
    });
  }

  editPublication(): void {
    if (this.editPublicationForm.valid) {

      this.isSubmitting = true;

      const formValues = this.editPublicationForm.value;
  
      // Combine new images with fetched current images as files
      this.convertCurrentImagesToFiles().then((currentImagesAsFiles: File[]) => {
        let allImages: File[] = [];

        if (this.firstImageFile) {
          allImages = [this.firstImageFile, ...currentImagesAsFiles, ...this.additionalImageFiles];
        } else {
          allImages = [...currentImagesAsFiles, ...this.additionalImageFiles];
        }
        
        this.publicationService.updatePublication(
          this.publicationElement!.id,
          formValues.type,
          formValues.title,
          formValues.content,
          formValues.dateAndTime,
          allImages
        ).subscribe({
          next: (res) => {
            alert(res.message);
            this.editPublicationForm.reset();

            this.firstImageFile = null;
            this.additionalImageFiles = [];

            this.firstImageInput.nativeElement.value = '';
            this.additionalImagesInput.nativeElement.value = '';
          },
          error: (err) => {
            alert(err.error?.error);
            this.firstImageFile = null;
            this.additionalImageFiles = [];

            this.firstImageInput.nativeElement.value = '';
            this.additionalImagesInput.nativeElement.value = '';
          },
          complete: () =>{
            this.isSubmitting = false;
            this.firstImageFile = null;
            this.additionalImageFiles = [];

            this.firstImageInput.nativeElement.value = '';
            this.additionalImagesInput.nativeElement.value = '';
          }
        });
      }).catch(error => {
        console.error('Error converting current images:', error);
      });
    } else {
      console.error("Form is invalid");
    }
  }
    
  deletePublication(){
    this.isSubmitting = true;
    if (confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε τη δημοσίευση;')){
      this.publicationService.deletePublication(this.publicationElement!.id).subscribe({
        next: (res) =>{
          alert(res.message);

          this.editPublicationForm.reset();
          this.firstImageFile = null;
          this.additionalImageFiles = [];
          this.publicationImages = [];
          this.publicationElement = null;

          this.firstImageInput.nativeElement.value = '';
          this.additionalImagesInput.nativeElement.value = '';

          this.selectType!.setValue(null);
          this.selectTitle!.disable();
          this.selectTitle!.setValue('');
          this.titlesList = [];
          this.filteredTitlesList = [];
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }

  /*
    ******************* Helper Methods *******************
    1) Autocomplete filter Title name
    2) Handle Images methods
    3) Check Form Validity
    4) Format Date
    4) Getters
  */

  // autocomplete method
  filterTitle(){
    const input = this.titleInput.nativeElement.value;
  
    if (!input) {
      this.filteredTitlesList = this.titlesList;
      return;
    }
  
    this.filteredTitlesList = this.titlesList.filter((option) => 
      option.title.toLowerCase().includes(input.toLowerCase())
    );
  }

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
    this.editPublicationForm.updateValueAndValidity();
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
    this.editPublicationForm.updateValueAndValidity();
  }

  atLeastOneImageValidator(): { [key: string]: boolean } | null {

    const noExistingImages = this.publicationImages.length === 0;
    const noFirstPhoto = !this.firstImageFile;
    // const noAdditionalPhotos = this.additionalImageFiles.length === 0;
  
    if (noExistingImages && noFirstPhoto) {
      return { noImages: true };
    }
    return null;
  }

  removeImage(index: number): void {
    this.publicationImages.splice(index, 1);
    this.editPublicationForm.updateValueAndValidity();
  }

  // Method to fetch images and convert them to File objects
  convertCurrentImagesToFiles(): Promise<File[]> {

    const fetchImagePromises = this.publicationImages.map((imageUrl, index) =>
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => new File([blob], `currentImage_${index}.jpg`, { type: blob.type }))
    );
  
    return Promise.all(fetchImagePromises);
  }

  formValidity(): boolean {
    return this.type!.invalid && this.type!.touched ||
           this.title!.invalid && this.title!.touched ||
           this.content!.invalid && this.content!.touched ||
           (this.dateAndTime!.invalid && this.dateAndTime!.touched)
  }

  //getters

  get selectType(){
    return this.editPublicationForm.get('selectType');
  }

  get selectTitle(){
    return this.editPublicationForm.get('selectTitle');
  }
  get type(){
    return this.editPublicationForm.get('type');
  }

  get title(){
    return this.editPublicationForm.get('title');
  }

  get content(){
    return this.editPublicationForm.get('content');
  }

  get dateAndTime(){
    return this.editPublicationForm.get('dateAndTime');
  }

  get firstImage() {
    return this.editPublicationForm.get('images.firstImage');
  }

  get additionalImages(){
    return this.editPublicationForm.get('images.additionalImages');
  }
}