import { Injectable, EventEmitter } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NoticesService } from './notices.service';
const { Network } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  networkListener;
  connected = true;
  connectionChange = new EventEmitter<boolean>();
  connectionStatusMessage: string;
  connectionStatus: string;
  constructor(
    private notice: NoticesService,

  ) {
    this.getStatus().then(
      (data) => {
        //this.connected = data.connected;
      }
    );

  }


  networkChanges() {
    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      if (status.connected === true) {
        this.connected = true;
        this.notice.presentToast("You are online", "success");
        this.connectionChange.emit(true);
      } else {
        this.connected = false;
        this.notice.presentToast("You are offline", "danger");
        this.connectionChange.emit(true);
      }
    });
  }

  async getStatus() {
    const status = await Network.getStatus();
    this.connectionChange.emit(status.connected);
    console.log(status);
    return status;
  }
}
