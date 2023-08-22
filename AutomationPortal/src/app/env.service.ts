import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

   // API url
   public baseUrl = '';
   // API SingleR
   public baseSingleRUrl = '';

   // Whether or not to enable debug mode
   public enableDebug = true;

  constructor() { }
}
