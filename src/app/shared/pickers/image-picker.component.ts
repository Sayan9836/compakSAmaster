import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { ImagesService } from '../services/images.service';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;
  loadImagePicker = false;
  loaderSub;
  constructor(
    private platform: Platform,
    private imagesService: ImagesService
  ) { }

  srcSub;
  btnTextSub;
  btnText = this.imagesService.btnText;
  usePicker = false;
  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
    this.srcSub = this.imagesService.imageSrcUpdated.subscribe(
      (src: string) => {
        this.selectedImage = src;
        console.log(this.selectedImage);
      }
    );
    this.btnTextSub = this.imagesService.btnTextUpdated.subscribe(
      (text: string) => {
        this.btnText = text;
      }
    );

  }
  ngOnDestroy(): void {
    this.srcSub.unsubscribe();
    this.btnTextSub.unsubscribe();
  }
  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(dataUrl);
    };
    fr.readAsDataURL(pickedFile);
    console.log(event);
  }
  onPickImage() {
    if (Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = image.base64String;
      this.imagePick.emit(image.base64String);
    }).catch(error => {
      console.log(error);
      return false;
    });

  }
}
