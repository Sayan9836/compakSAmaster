import { Injectable, EventEmitter } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {

  constructor(
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    public alertCtrl: AlertController
  ) { }
  isLoading = false;

  killLoader = new EventEmitter<boolean>();
  loadLoader = new EventEmitter<boolean>();
  loading = new EventEmitter<boolean>();
  loadingSpinner = false;
  showLoader() {
    this.loadingSpinner = true;
    this.loading.emit(this.loadingSpinner);

  }
  hideLoader() {
    this.loadingSpinner = false;
    this.loading.emit(this.loadingSpinner);

  }
  loadSub;
  killSub;
  async presentToast(message, color) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }
  async createLoader() {
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(
      (a) => {
        this.loadSub = this.loadLoader.subscribe(
          (state) => {
            a.present().then(
              () => {
                console.log('presented');
              });
          });
        this.killSub = this.killLoader.subscribe(
          (state) => {
            a.dismiss().then(
              () => {
                console.log('abort presenting');
                // this.loaderSub.unsubscribe();
              }
            );

          });
      });
  }

  async presentLoader() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.loadLoader.emit(true);
    }
    // this.isLoading = true;
    // return await this.loadingController.create({
    //   message: 'Please wait...',
    // }).then(a => {
    //   a.present().then(() => {
    //     console.log('presented');
    //     this.loaderSub = this.killLoader.subscribe(
    //       (state) => {
    //         a.dismiss().then(
    //           () => {
    //             console.log('abort presenting');
    //             this.loaderSub.unsubscribe();
    //           }
    //         );

    //       }
    //     );
    //     // if (!this.isLoading) {
    //     //   a.dismiss().then(() => console.log('abort presenting'));
    //     // }
    //   });
    // });
  }

  async dismissLoader() {
    if (this.isLoading) {
      this.isLoading = false;
      this.killLoader.emit(true);
    }
    // this.isLoading = false;
    // return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async presentAlertConfirm(message, handler) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Proceed',
          handler: handler
        }
      ]
    });

    alert.present();
  }

}
