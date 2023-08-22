import { Injectable } from '@angular/core';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private env: EnvService) { 
    //console.log("this.env.baseUrl",this.env.baseUrl)
  }
  
  public baseUrl:string = this.env.baseUrl;
  public baseSingleRUrl:string = this.env.baseSingleRUrl;
}
