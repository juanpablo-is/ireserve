import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage-service';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.sass']
})
export class MenuOptionComponent {

  @Input() items: any = [];
  @Input() optionName: string;
  @ViewChild('show') eShow: ElementRef;
  @ViewChild('addName') addName: ElementRef;
  @ViewChild('addPrice') addPrice: ElementRef;
  @ViewChild('addDescription') addDescription: ElementRef;
  @ViewChild('addImage') addImage: ElementRef;

  isShowed = false;
  validateButton = false;
  file: any;

  constructor(private serviceStorage: FirebaseStorageService) { }

  showListOfItems(): void {
    if (this.isShowed === true) {
      this.eShow.nativeElement.classList.add('hidden');
    } else {
      this.eShow.nativeElement.classList.remove('hidden');
    }
    this.isShowed = !this.isShowed;
  }

  add(): void {
    const newName = this.addName.nativeElement.value;
    const newPrice = this.addPrice.nativeElement.value;
    const newDescription = this.addDescription.nativeElement.value;
    const newImage = this.addImage.nativeElement;

    if (newName && newPrice) {
      if (newImage.files.length > 0) {
        this.file = newImage.files[0];

        const filePath = `${this.file.name}-${Date.now()}`;
        const referenceFile = this.serviceStorage.referenceStorage(filePath);
        const taskUpload = this.serviceStorage.uploadStorage(filePath, this.file);
        taskUpload.snapshotChanges().pipe(
          finalize(() => {
            referenceFile.getDownloadURL().subscribe((url: string) => {
              this.items.push({ name: newName, price: newPrice, description: newDescription, urlPhoto: url });
              this.addName.nativeElement.value = '';
              this.addPrice.nativeElement.value = '';
              this.addDescription.nativeElement.value = '';
              this.addImage.nativeElement.value = '';
              this.validateButton = false;
            });
          })
        ).subscribe();
      }
    }
  }

  changeFile(event: any): void {
    if (event.target.files.length > 0) {
      this.validateButton = true;
    }
  }
}
