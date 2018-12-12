import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Storage } from '@ionic/storage';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { Http } from '@angular/http';
// import { map, filter, switchMap } from 'rxjs/operators';
// import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


import { NetsolinApp } from '../shared/global';
// import {URL_NETSOLIN} from "../config/url.servicios";

export interface Item { name: string; }

@Injectable({
  providedIn: 'root'
})
export class ParEmpreService {

  parEmpre: any = {};
  licenValida=false;
  datoslicencia: any={};
  usuario: any={};
  usuario_valido=false;
  menerror_usuar="";
  // private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;
  URL_SERVICIOS: string ="";
  
  constructor(
    private afDB: AngularFirestore,
    private platform: Platform,
    private storage: Storage,
    // public http: Http
    private http: HttpClient
    // public http: Http

  ) {

   }
// Verifica usuario en url de empresa en Netsolin
verificausuarioNetsolin(codigo: string,psw:string,plogeo:string ) {
  this.licenValida=false;
  let promesa = new Promise((resolve,reject)=>{
    NetsolinApp.objenvrest.filtro = codigo;
    NetsolinApp.objenvrest.usuario=codigo;
    NetsolinApp.objenvrest.psw = psw;
    console.log(" verificausuarioNetsolin 1");
    console.log(codigo);    
    let url= this.URL_SERVICIOS + "netsolin_servirestgo.csvc?VRCod_obj=VALUSUARAPP&VTIPOLOG="+plogeo;
    console.log(url);
    console.log(NetsolinApp.objenvrest);
    console.log(" verificausuarioNetsolin 2");
    this.http.post( url, NetsolinApp.objenvrest )   
     .subscribe( (data:any) =>{ 
      console.log(" verificausuarioNetsolin 3");
      console.log(data);  
      if( data.error){
          console.log(" verificausuarioNetsolin 31");
        // Aqui hay un problema
         console.log('data.messages');
         console.log(data.menerror);
         this.usuario_valido=false;
         this.menerror_usuar="Error llamando servicio verificar usaurio en Netsolin "+data.menerror;
         this.usuario = null;
         resolve(false);
        }else{
          console.log(" verificausuarioNetsolin 32");
          console.log('Datos traer verificausuarioNetsolin');
          this.usuario_valido=true;
          this.menerror_usuar="";
          this.usuario = data;
          console.log(data);
          resolve(true);
        }
      console.log(" verificaLicencia 4");
     })
     console.log(" verificaLicencia 5");
   });
   return promesa;
}

  
// Verifica licencia en sistemas integrales de colombia
verificaLicencia( nit: string ) {
    this.licenValida=false;
    let promesa=new Promise((resolve,reject)=>{
      NetsolinApp.objenvrest.filtro = nit;
      console.log(" verificaLicencia 1");
      console.log(nit);
      
      // let url= URL_NETSOLIN + "netsolin_servirestgo.csvc?VRCod_obj=VALLICENAPPS"
      let url = NetsolinApp.urlNetsolinverilicen + "netsolin_servirestgo.csvc?VRCod_obj=VALLICENAPPS"
      console.log(url);
      console.log(NetsolinApp.objenvrest);
      console.log(" verificaLicencia 2");
      this.http.post( url, NetsolinApp.objenvrest )   
       .subscribe( (data:any) =>{ 
        console.log(" verificaLicencia 3");
        console.log(data);
        if(data.error){
          console.log('error verificando licencia:'+data.menerror)
          this.licenValida = false;
          this.datoslicencia = null;
          this.URL_SERVICIOS = '';
          resolve(false);
        }else{
          console.log('se verifico licencia ok');
          console.log('Datos traer licencia');
          this.licenValida = true;
          this.datoslicencia = data;
          this.URL_SERVICIOS = this.datoslicencia.url_publica;
          console.log(data);
          resolve(true);
        }
        console.log(" verificaLicencia 4");
       })
       console.log(" verificaLicencia 5");
          // resolve(false);
     });
     return promesa;
}

  verificaParametro() {
    var clave = 'general';
    return new Promise( (resolve, reject) => {
    this.afDB.doc(`/par_empre/${ clave }`)
      .valueChanges().subscribe( data => {
          // console.log(data);
            if (data) {
              // correcto
              this.parEmpre = data;
              this.guardarStorage(this.parEmpre);
              resolve(true);
            } else{ 
              // incorrecto
              resolve(false);
            }
            resolve();
        })
      });
  }


  guardarLicenciaStorage() {

    if ( this.platform.is('cordova')  ){
      // Celular
      this.storage.set('net_licencia',this.datoslicencia);

    } else {
      // Escritorio
      localStorage.setItem('net_licencia', JSON.stringify(this.datoslicencia));
    }

  }

  cargarLicenciaStorage() {
    return new Promise( (resolve, reject) => {
      if ( this.platform.is('cordova')  ){
        // Celular       
        this.storage.get('net_licencia').then( val => {
          if ( val ) {
            this.datoslicencia = val;
            resolve(true);
          }else {
            resolve(false);
          }
        });        
      } else {
        // Escritorio
        console.log('carga licencia storage 1');
        if ( localStorage.getItem('net_licencia')){
          console.log('carga licencia storage 2');         
          this.datoslicencia = JSON.parse( localStorage.getItem("net_licencia"));
          // this.parEmpre = localStorage.getItem('net_licencia');
          console.log('carga licencia storage 3');
          console.log(this.datoslicencia);
          this.URL_SERVICIOS = this.datoslicencia.url_publica;
          //si tiene firebase inicializar
          if (this.datoslicencia.util_firebase){
            // var config = {
            //   apiKey: "AIzaSyDz_d6qIjTAN_-lU8neFAKQIbnmMkqpKoU",
            //   authDomain: "catalogo-43ff6.firebaseapp.com",
            //   databaseURL: "https://catalogo-43ff6.firebaseio.com",
            //   projectId: "catalogo-43ff6",
            //   storageBucket: "catalogo-43ff6.appspot.com",
            //   messagingSenderId: "254647114546"
            //  };    
            //  TestBed.configureTestingModule({
            //   imports: [
            //     AngularFireModule.initializeApp(config),
            //   ]
            // });             
            // const appnetsolinpar = AngularFireModule.initializeApp(this.datoslicencia.key_firebase);
            // const appnetsolinpar = AngularFireModule.initializeApp(config);
            console.log('Verificando par en db netsolin appnetsolinpar:');
            // console.log(appnetsolinpar);
          }
          resolve(true);
        }else {
          console.log('resuelve falso no hay en storage datos licencia');
          resolve(false);
        }        
      }
    });
  }


  borrarLicenciaStorage() {

    this.parEmpre = null;

    if ( this.platform.is('cordova') ) {
      this.storage.remove('net_licencia');
    }else {
      localStorage.removeItem('net_licencia');
    }

    // this.doc.unsubscribe();

  }


  guardarStorage(datos) {

    if ( this.platform.is('cordova')  ){
      // Celular
      this.storage.set('par_empe',datos);

    } else {
      // Escritorio
      localStorage.setItem('par_empre', datos);
    }

  }

  cargarStorage() {
    return new Promise( (resolve, reject) => {
      if ( this.platform.is('cordova')  ){
        // Celular       
        this.storage.get('par_empre').then( val => {
          if ( val ) {
            this.parEmpre = val;
            resolve(true);
          }else {
            resolve(false);
          }
        });        
      } else {
        // Escritorio
        if ( localStorage.getItem('par_empre')){
          this.parEmpre = localStorage.getItem('par_empre');
          resolve(true);
        }else {
          resolve(false);
        }        
      }
    });
  }


  borrarParempre() {

    this.parEmpre = null;

    if ( this.platform.is('cordova') ) {
      this.storage.remove('par_empre');
    }else {
      localStorage.removeItem('par_empre');
    }

    // this.doc.unsubscribe();

  }


  guardarUsuarioStorage() {

    if ( this.platform.is('cordova')  ){
      // Celular
      this.storage.set('net_usuario',this.usuario);

    } else {
      // Escritorio
      localStorage.setItem('net_usuario', JSON.stringify(this.usuario));
    }

  }

  cargarUsuarioStorage() {
    return new Promise( (resolve, reject) => {
      if ( this.platform.is('cordova')  ){
        // Celular       
        this.storage.get('net_usuario').then( val => {
          if ( val ) {
            this.usuario = val;
            resolve(true);
          }else {
            resolve(false);
          }
        });        
      } else {
        // Escritorio
        if ( localStorage.getItem('net_usuario')){
          this.usuario = JSON.parse( localStorage.getItem("net_usuario"));
          resolve(true);
        }else {
          resolve(false);
        }        
      }
    });
  }


  borrarUsuarioStorage() {

    this.usuario = null;

    if ( this.platform.is('cordova') ) {
      this.storage.remove('net_usuario');
    }else {
      localStorage.removeItem('net_usuario');
    }
  }

//sERVICIOS COMO FUNCIONES DE LIBRERIA ADICIONALES A JS
//COMPLETA UNA CADENA CON 0 A LA IZQUIERDA DE NUMERO Y LONGITUD DADA

 zfill(number, width) {
  var numberOutput = Math.abs(number); /* Valor absoluto del número */
  var length = number.toString().length; /* Largo del número */ 
  var zero = "0"; /* String de cero */  
  
  if (width <= length) {
      if (number < 0) {
           return ("-" + numberOutput.toString()); 
      } else {
           return numberOutput.toString(); 
      }
  } else {
      if (number < 0) {
          return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
      } else {
          return ((zero.repeat(width - length)) + numberOutput.toString()); 
      }
  }
}
//cadena formato AAAAMMDD A FECHA TIEMPO 0
cadafecha(cfecha){
  let ano = cfecha.slice(0,4);
  let mes = cfecha.slice(4,6);
  let dia = cfecha.slice(6,8);

  let dfecha = new Date(ano,mes,dia,0,0,0);
  return dfecha;
}

//recibe hora militar como numero y retorna cadena formato HH:MM AM/PM
cadhoramil(nhora){
  let ch = nhora.toString();
  let chh = '';
  let cmm = '';
  let campm = '';
  let nnh = 0;
  if (nhora < 1000) {
    chh = ch.slice(0,1);
    cmm = ch.slice(1,3); 
  } else {
    chh = ch.slice(0,2);
    cmm = ch.slice(2,4);  
  }
  if(nhora < 1200){
    campm = 'AM';      
  } else {
    nnh = parseInt(chh) - 12;
    chh = nnh.toString();
    campm = 'PM';      
  }

  return chh+':'+cmm+' '+campm;
}

}
