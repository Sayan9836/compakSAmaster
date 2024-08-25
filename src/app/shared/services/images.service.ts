import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor() { }

  imageSrcUpdated = new EventEmitter<string>();
  btnTextUpdated = new EventEmitter<string>();
  selectedImage: string = null;
  currentImage;
  btnText = 'Select Profile Picture';

  updateImage(src) {
    this.selectedImage = src;
    this.imageSrcUpdated.emit(src);
  }

  updateBtnText(text) {
    this.btnText = text;
    this.btnTextUpdated.emit(text);
  }
}
