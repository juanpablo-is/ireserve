import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FirebaseStorageService } from 'src/app/services/firebase-storage/firebase-storage-service';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.sass']
})
export class MenuOptionComponent implements OnInit {
  @Input() items: any;
  @Input() categories: any;
  @ViewChild('show') eShow: ElementRef;
  @ViewChild('addName') addName: ElementRef;
  @ViewChild('addPrice') addPrice: ElementRef;
  @ViewChild('addDescription') addDescription: ElementRef;
  optionName: string;
  isShowed = false;
  file:any;
  urlPhoto: string;
  constructor(
    private serviceStorage: FirebaseStorageService) {}

  ngOnInit(): void {
    this.optionName = this.items.categoryName;
  }

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
    if (newName && newPrice) {
      this.items.categoryValues.push({ name: newName, price: newPrice, description: newDescription, urlPhoto: this.urlPhoto});
      this.addName.nativeElement.value = '';
      this.addPrice.nativeElement.value = '';
      this.addDescription.nativeElement.value = '';
    }
    console.log(this.items);
  }
  changeFile(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      console.log(this.file);
    }
    const filePath = `${this.file.name}-${Date.now()}`;
    const referenceFile = this.serviceStorage.referenceStorage(filePath);
    const taskUpload = this.serviceStorage.uploadStorage(filePath, this.file);
    taskUpload.snapshotChanges().pipe(
      finalize(() => {
        referenceFile.getDownloadURL().subscribe((url: string) => {   
          this.urlPhoto = url;         
        });
      })
    ).subscribe();
    alert("imagen subida");
  }
}
