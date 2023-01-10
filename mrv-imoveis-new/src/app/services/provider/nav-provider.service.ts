import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

export class NavProviderService {
  object: any;

  constructor(private cache: CacheService, private storage: NativeStorage){
  }

  PegarEmailStorage() {
    return this.storage.getItem("email_usuario");
  }
}
