import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { NetworkService } from "./network.service";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  sync = true;
  constructor(private network: NetworkService) {
    this.getItem("sync").then((data) => {
      if (data === "true") {
        this.network.connected = false;
        this.sync = true;
        console.log("Offline Mode");
      } else {
        console.log("Online Mode");
        this.network.connected = true;
        this.sync = false;
      }
    });
  }

  offlineMode(offline) {
    // this.sync = offline;
    this.setItem("sync", offline);
    if (this.sync === true) {
      this.network.connected = false;
      this.sync = true;
      console.log("Offline Mode");
    } else {
      console.log("Online Mode");
      this.network.connected = true;
      this.sync = false;
    }
  }
  syncData(sync) {
    this.sync = sync;
  }
  async setObject(key, data) {
    await Storage.set({
      key: key,
      value: JSON.stringify(data),
    });
  }

  async getObject(key) {
    const ret = await Storage.get({ key: key });
    // console.log(JSON.parse(ret.value))
    return JSON.parse(ret.value);
  }

  async setItem(key, value) {
    await Storage.set({
      key: key,
      value: value,
    });
  }

  async getItem(key) {
    const result = await Storage.get({ key: key });
    return result.value;
  }

  async removeItem(key) {
    await Storage.remove({ key: key });
  }

  async keys() {
    const keys = await Storage.keys();
    console.log("Got keys: ", keys);
  }

  async clear() {
    await Storage.clear();
  }
}
