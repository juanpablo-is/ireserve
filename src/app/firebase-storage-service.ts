import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private storage: AngularFireStorage) { }

  // Función que sube imagen a Firestore Storage.
  uploadStorage(nombreArchivo: string, datos: any): any {
    return this.storage.upload(nombreArchivo, datos);
  }

  // Devuelve referencia Firebase de acuerdo a path del archivo.
  referenceStorage(nombreArchivo: string): any {
    return this.storage.ref(nombreArchivo);
  }
}
