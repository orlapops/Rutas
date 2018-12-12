import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { ParEmpreService } from '../providers/par-empre.service';
import { NetsolinApp } from '../shared/global';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//Nuevo provider Visitas Op Nov 16 2018
//Comunicaciòn con firebase y relacionado con bd

export class VisitanService {
  public visitaList: AngularFirestoreCollection<any>;
  public userId: string;
  public cargoidperiodo = false;
  public id_ruta = 0;
  public id_periodo: string;
  public cargo_ruta = false;
  public visitaTodas: any;
  public visitasProximas: any;
  public visitasCumplidas: any;
  public visitasUltimas: any;
  public error_cargarruta = false;
  public men_errorcargarruta = "";
  visitas_cumplidas: any[] = [];
  visitas_pendientes: any[] = [];
  visitas_incumplidas: any[] = [];

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    // private afStorage: AngularFireStorage,
    public _parempre: ParEmpreService
  ) {
    //pendiente parte de autorizaciòn 
    // this.afAuth.authState.subscribe(user => {
    //   this.userId = user.uid;
    //   this.visitaList = this.firestore.collection(`/userProfile/${user.uid}/billList`);
    // });
      this.userId = _parempre.usuario.cod_usuar;
      //para prueba
      console.log('En servicio VisitanService');
      //this._parempre.usuario.cod_usuar

  }
  // getVisitasList(): AngularFirestoreCollection<any> {
  public getVisitasList() {
    // console.log('En servicio VisitanService getVisitasList');
    // console.log(this.userId,this.id_ruta,this.id_periodo);
    this.visitaList = this.firestore.collection(`/personal/${this.userId}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`);
    
    // return this.firestore.collection(`/personal/${this.userId}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`).valueChanges();

    // this.visitnanList = this.viistaService.getVisitasList().valueChanges();

    console.log('clasificando visitas 1 ', this.visitaList);
    // this.visitas_cumplidas = this.visitaList.filter(reg => reg.data.estado === 'C');
    // this.visitas_pendientes = this.visitaList.filter(regP => regP.data.estado === 'P');

    return this.visitaList;
  }

  public getVisitasobs() {
    // console.log('En servicio VisitanService getVisitasList');
    // console.log(this.userId,this.id_ruta,this.id_periodo);
    // this.visitaList = this.firestore.collection(`/personal/${this.userId}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`);
    
    return this.firestore.collection(`/personal/${this.userId}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`).valueChanges();

    // this.visitnanList = this.viistaService.getVisitasList().valueChanges();

    console.log('clasificando visitas 1 ', this.visitaList);
    // this.visitas_cumplidas = this.visitaList.filter(reg => reg.data.estado === 'C');
    // this.visitas_pendientes = this.visitaList.filter(regP => regP.data.estado === 'P');

    return this.visitaList;
  }

  // cargaVisitas(){
  //   return new Promise((resolve, reject) =>{
  //     this.getVisitasobs().subscribe()=>{
        
  //     }
  //      .getVisitasList().subscribe((datos:any) =>{
  //       if(datos.length > 0) {
  //       } else

  //     })
  //   })
  // }
//Consulta en Netsolin el usuario con la fecha para saber que ruta y periodo le corresponde
  cargaPeriodoUsuar(pcod_usuar){
    return new Promise((resolve,reject)=>{
      if (this.cargoidperiodo){
          resolve(true); 
       }
        NetsolinApp.objenvrest.filtro = pcod_usuar;
        let url= this._parempre.URL_SERVICIOS + "netsolin_servirestgo.csvc?VRCod_obj=IDRUTAPERAPP";
        this.http.post( url, NetsolinApp.objenvrest )   
         .subscribe( (data:any) =>{ 
          if( data.error){
              console.error(" cargaPeriodoUsuar ", data.error);
             this.cargoidperiodo = false;
             resolve(false);
            } else{
              this.cargoidperiodo = true;
              this.id_ruta = data.datos_ruta[0].id_ruta;
              this.id_periodo = data.datos_periodo[0].id_per;
              resolve(true);
            }
         });
       });
  }

  clasificaVisitas() {

  //   this.visitas_pendientes = this.visitaTodas.filter(function() { 
  //         // number > 10 
  //     //   this.visitaTodas => this.visitaTodas.estado === 'P';
  //     });

  //   for (var i = 0; i < this.visitaTodas.length; i++) {
  //     console.log('clasificando visitas 2');
  //     console.log(this.visitaTodas[i]);
  //     console.log(this.visitaTodas.slice(i , 1));
  //     console.log('clasificando visitas 2.1');
  //     if (this.visitaTodas[i].estado === 'P') {
  //         console.log('clasificando visitas 3');
  //         // this.visitas_pendientes.push(this.visitaTodas.slice(i , 1));
  //         this.visitas_pendientes.push(this.visitaTodas[i]);
  //     }
  //     if (this.visitaTodas[i].estado === 'C') {
  //         console.log('clasificando visitas 4');
  //        this.visitasCumplidas.push(this.visitaTodas.slice(i , 1));
  //     }
  // }
  console.log('clasificando visitas 5');
  console.log(this.visitas_pendientes);
  console.log(this.visitas_cumplidas);
}

  // getVisita(visitaId: string): AngularFirestoreDocument<any> {
  //   return this.firestore.doc(`/userProfile/${this.userId}/billList/${visitaId}`);
  // }

  
}  
