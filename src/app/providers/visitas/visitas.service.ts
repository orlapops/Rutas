import { Injectable } from '@angular/core';
import { VISITAS } from "./mock-visitas";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ParEmpreService } from '../../providers/par-empre.service';
import { NetsolinApp } from '../../shared/global';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ClienteProvider } from '../cliente.service';
// import { MessageService } from '../message/message.service';
// import { ConsoleReporter } from 'jasmine';

@Injectable({
  providedIn: 'root'
})

export class VisitasProvider {
    //AQUI CAMBIAR PARA QUE TRAIGA LA BODEGA QUE LE PERTENECE A LA RUTA
    bodega = 'VEH';
    id_ruta: number = 0;
    visitaclienteactual: AngularFirestoreDocument<any>;
    visitas: any;
    room: any;
    facturaCounter: number = 0;
    factura: Array<any> = [];
    recibocajaCounter: number = 0;
    recibocaja: Array<any> = [];
  

    bookingCounter: number = 0;
    bookings: Array<any> = [];
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
    cartera: Array<any> = [];
    cargocarteraNetsolin = false;
    visita_activa: any;
    cargoInventarioNetsolin = false;
    inventario: Array<any> = [];
    public userId: string;
    public cargoidperiodo = false;
    public id_periodo: string;
      
    constructor(private fbDb: AngularFirestore,
        private http: HttpClient,
        public _cliente: ClienteProvider,
        // public _message: MessageService,
        public _parempre: ParEmpreService) {
        this.visitas = VISITAS;
    }

    inicializarVisitaActual(id){
        console.log('inicializarVisitaActual id',id);
        this.visitaclienteactual = this.fbDb.doc(`/reg_visitas/${ id }`);
        console.log('visitaclienteactual: ', this.visitaclienteactual);
      }
//   //Obtiene id de fecha referencia
//   public getIdFecha(fechaId: string) {
//     return this.fbDb.collection('manfechas').doc(fechaId).snapshotChanges();
//   }      
  //Obtiene todas las fechas
//   public getAllFechas() {
//     // return this.fbDb.collection('manfechas').snapshotChanges();
//     return this.fbDb.collection('manfechas').valueChanges();
//   }      
  
  //Obtiene la fecha que corresponde a usuario actual y una fecha dada en timestamp
//   public getFechaUsaurio(fechats) {
//     // return this.fbDb.collection('manfechas').snapshotChanges();
//     console.log('getFechaUsaurio');
//     console.log(fechats);
//     console.log(this._parempre.usuario.cod_usuar);
//     return this.fbDb.collection('manfechas', ref => ref.where('fecha', '==', fechats)).valueChanges();
//     //   .where('cod_person', '==', this._parempre.usuario.cod_usuar)).valueChanges();

// }

  //Obtiene la fecha que corresponde a usuario actual y una fecha dada en timestamp
//   public getVisitasidFecha(fechaid, idruta) {
//     // return this.fbDb.collection('manfechas').snapshotChanges();
//     console.log('getFechaUsaurio');
//     console.log(fechaid);
//     console.log(this._parempre.usuario.cod_usuar);
//     // return this.fbDb.collection('rutas_d', ref => ref.where('id_reffecha', '==', fechaid).orderBy('fecha_in')).valueChanges();
//     return this.fbDb.collection('rutas_d', ref => ref.where('id_reffecha', '==', fechaid)
//         .where('id_ruta','==',idruta).orderBy('fecha_in')).snapshotChanges();
//     //   .where('cod_person', '==', this._parempre.usuario.cod_usuar)).valueChanges();
    
//   }      
  
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

  //Obtiene las visitas que corresponde a la fecha y ruta tomada de carga anterior en netsolin
  public getVisitasidrutper() {
    return this.fbDb
        .collection(`/personal/${this.userId}/rutas/${this.id_ruta}/periodos/${this.id_periodo}/visitas`)
        .snapshotChanges();
    
  }      
  
  public guardarVsita(id, visitaadd){
      console.log('guardarVsita id:' + id);
      console.log(visitaadd);
    return this.fbDb.collection('reg_visitas').doc(id).set(visitaadd);
  }
  
  //Obtiene visita por id de la visita
  public getIdRegVisita(visitaId: string) {
      console.log('en getIdRegVisita');
    return this.fbDb.collection('reg_visitas').doc(visitaId).valueChanges();
  }      
  
  //Carga la visita activa busca si esta creada en reg_visitas, si no la crea si esta la trae
  //recibe la visita activa con el id busca y carga cartera de netsolin si no lo ha echo
  cargaVisitaActiva(visitaAct: any){
    this.visita_activa = null;
    // if (!this.cargocarteraNetsolin){
        //llamar a Netsolin para traer la cartera
        this._cliente.cargaClienteNetsolin(visitaAct.data.cod_tercer).then(cargo =>{
//        this.cargaCarteraNetsolin(visitaAct.data.cod_tercer).then(cargo =>{
            console.log('En cargaVisitaActiva 14 visitaAct.id:', visitaAct.id);
            console.log('En cargaVisitaActiva cargo:', cargo);
            this.getIdRegVisita(visitaAct.id).subscribe((datos: any) => {
                console.log('En cargaVisitaActiva 1 datos:', datos);                
                if (datos) {
                    console.log('En cargaVisitaActiva 2');
                    console.log('obtuvo visita actual datos:', datos);
                    // datos.cartera = this.cartera;
                    datos.cartera = this._cliente.clienteActual.cartera;
                    datos.datosgen = visitaAct.data;
                    this.visita_activa = datos;
                    //actualizar firebase cloud cliente
                    this._cliente.guardarCliente(visitaAct.data.cod_tercer).then(res =>{
                         console.log('Cliente '+visitaAct.cod_tercer+' guardado en dbFB')
                    });
                    this.guardarVsita(visitaAct.id, this.visita_activa).then(res => {
                        console.log('Visita guardada');
                    });
                } else {
                    console.log('En cargaVisitaActiva 3');
                    console.log('no se ha creado la visita en reg_visitas');
                    const fh = Date.now();
                    const visitaadd = {
                        datosgen : visitaAct.data,
                        estado : '',
                        fechahora_ingreso : fh,
                        cartera : this.cartera
                    };
                    this._cliente.guardarCliente(visitaAct.data.cod_tercer).then(res =>{
                        console.log('Cliente '+visitaAct.cod_tercer+' guardado en dbFB')
                   });
                    this.guardarVsita(visitaAct.id, visitaadd).then(res => {
                        console.log('Visita guardada');
                    });
                }
            });
        })
        .catch(() => {
            console.log('error en carga visita activa');
        });
        console.log('En cargaVisitaActiva 5');
    // }
  }

  cargaVisitas(){
    console.log('Ingreso a cargo visitas');
    return new Promise( (resolve, reject) => {
        console.log('cargaVisitas 1');
        this.getVisitasidrutper().subscribe((datosv: any) => {
                      console.log('lo que llega de visitas de un id de fecha');
                      console.log(datosv);
                      if(datosv.length > 0) {
                        let itemdato = datosv[0];
                        console.log(itemdato);
                        console.log(itemdato.payload);
                        console.log(itemdato.payload.doc);
                        console.log(itemdato.payload.doc.data());
                        console.log(itemdato.payload.doc.id);
  
                        console.log('cambia a cargo ruta');
                          this.cargo_ruta = true;
                          this.error_cargarruta = false;
                        //   this.visitaTodas = datosv;
                        this.visitaTodas = [];
                        datosv.forEach((visiData: any) => {
                            this.visitaTodas.push({
                              id: visiData.payload.doc.id,
                              cargocartera: false,
                              data: visiData.payload.doc.data()
                            });
                          });   
                          console.log('Todas las visitas con id');
                          console.log(this.visitaTodas);                     
                          this.clasificaVisitas();
                          resolve(true);
                      } else {
                          console.log('no hay datos en este id');
                          this.cargo_ruta = false;
                          this.error_cargarruta = true;
                          this.visitaTodas = null;
                          this.men_errorcargarruta = "No tiene visitas asignadas para esta ruta";          
                          resolve(false);
                      }
                  });        
        }); 
  }

    //Retorna la cartera de Netsolin de la visita actual
  cargaCartera() {


    }
// Verifica usuario en url de empresa en Netsolin
cargaCarteraNetsolin(cod_tercer: string) {
    let promesa = new Promise((resolve,reject)=>{
    if (this.cargocarteraNetsolin){
        console.log('resolve true cargo cartera netsolin por ya estar inciada');
        resolve(true); 
     }
      NetsolinApp.objenvrest.filtro = cod_tercer;
      console.log(" verificausuarioNetsolin 1");
      let url= this._parempre.URL_SERVICIOS + "netsolin_servirestgo.csvc?VRCod_obj=CARTEXCLIEAPP";
      console.log(url);
      console.log(NetsolinApp.objenvrest);
      console.log(" cargaCarteraNetsolin 2");
      this.http.post( url, NetsolinApp.objenvrest )   
       .subscribe( (data:any) =>{ 
        console.log(" cargaCarteraNetsolin 3");
        console.log(data);  
        if( data.error){
            console.log(" cargaCarteraNetsolin 31");
          // Aqui hay un problema
           console.log('data.messages');
           console.log(data.menerror);
           this.cargocarteraNetsolin = false;
        //    this.menerror_usuar="Error llamando servicio cargaCarteraNetsolin en Netsolin "+data.menerror;
           this.cartera = null;
           resolve(false);
          }else{
            console.log(" cargaCarteraNetsolin 32");
            console.log('Datos traer cargaCarteraNetsolin');
            this.cargocarteraNetsolin=true;
            // this.menerror_usuar="";
            this.cartera = data.cartera;
            console.log(data.cartera);
            resolve(true);
          }
        console.log(" cargaCarteraNetsolin 4");
       })
       console.log(" cargaCarteraNetsolin 5");
     });
     return promesa;
  }
  
  // Carga Inventario de la bodega en Netsolin
cargaInventarioNetsolin() {
    return new Promise((resolve,reject)=>{
    if (this.cargoInventarioNetsolin){
        console.log('resolve true cargo inventario netsolin por ya estar inciada');
        resolve(true); 
     }
      NetsolinApp.objenvrest.filtro = this.bodega;
      console.log(" cargaInventarioNetsolin 1");
      let url= this._parempre.URL_SERVICIOS + "netsolin_servirestgo.csvc?VRCod_obj=INVXBODAPP";
      console.log('cargaInventarioNetsolin url', url);
      console.log('cargaInventarioNetsolin NetsolinApp.objenvrest', NetsolinApp.objenvrest);
      this.http.post( url, NetsolinApp.objenvrest )   
       .subscribe( (data:any) =>{ 
        console.log(" cargaInventarioNetsolin data:", data);
        if( data.error){
            console.error(" cargaInventarioNetsolin ", data.error);
           this.cargoInventarioNetsolin = false;
           this.inventario = null;
           resolve(false);
          } else{
            console.log('Datos traer cargaInventarioNetsolin ', data.inventario);
            this.cargoInventarioNetsolin =true;
            // this.menerror_usuar="";
            this.inventario = data.inventario;
            resolve(true);
          }
        console.log(" cargaInventarioNetsolin 4");
       })
     });
  }
  //guardar el inventario en firebase
  public guardarInvdFB(id, inventario) {
    console.log('guardarInvdFB id:', id, inventario);
  return this.fbDb.collection('inventario').doc(id).set(inventario);
}

  //Obtiene inventario bodega de firebase
  public getInvdFB(inventarId: string) {
    console.log('en getInvdFB');
  return this.fbDb.collection('inventario').doc(inventarId).valueChanges();
}      

   //cargar de firebase el inventario suscribirse para que quede actualizado
   cargaInventariodFB(bodega) {
    this.getInvdFB(bodega).subscribe((datos: any) => {
        console.log('En cargaInventariodFB 1 datos:', datos);                
        if (datos) {
            console.log('obtuvo inventario de firebase inventario antes:', this.inventario);
            console.log('obtuvo inventario de firebase actual datos:', datos);
            this.inventario = datos.inventario;
            console.log('obtuvo inventario de firebase inventario despues:', this.inventario);
        } 
    });
   }

  clasificaVisitas() {
      console.log('clasificando visitas 1');
      this.visitas_cumplidas = this.visitaTodas.filter(reg => reg.data.estado === 'C');
      this.visitas_pendientes = this.visitaTodas.filter(regP => regP.data.estado === 'P');
    // console.log('clasificando visitas 5');
    // console.log(this.visitas_pendientes);
    // console.log(this.visitas_cumplidas);
  }


    getAll() {
        return this.visitas;
    }

    //Retorna una visita especidica para ser mostrada en detalle visitas
    getItem(id) {        
        this.cargocarteraNetsolin = false;
        for (var i = 0; i < this.visitaTodas.length; i++) {
            if (this.visitaTodas[i].id === id) {
                //cargar visita activa
                console.log('En getItem id:' + id);
                console.log(this.visitaTodas[i]);
                this.cargaVisitaActiva(this.visitaTodas[i]);
                return this.visitaTodas[i];
            }
        }
        return null;
    }


    remove(item) {
        this.visitas.splice(this.visitas.indexOf(item), 1);
    }

    /////
    //For Search and factura
    ////
    findAll() {
        return Promise.resolve(this.visitas);
    }

    findById(id) {
        return Promise.resolve(this.visitas[id - 1]);
    }

    findByName(searchKey: string) {
        let key: string = searchKey.toUpperCase();
        return Promise.resolve(this.visitas.filter((property: any) =>
            (property.title + ' ' + property.address + ' ' + property.city + ' ' + property.description)
            .toUpperCase().indexOf(key) > -1));
    }

    buscarProducto(searchKey: string) {

        console.log('buscarProducto searchKey:', searchKey);
        let key: string = searchKey.toUpperCase();
        console.log('buscarProducto key:', key);
        console.log(this.inventario);
         return Promise.resolve(this.inventario.filter((item: any) =>
            item.cod_refinv.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 
            || item.nombre.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 ));
    }


    findByCliente(searchKey: string) {
        console.log('findByCliente searchKey:', searchKey);
        console.log(this.visitaTodas);
         return Promise.resolve(this.visitaTodas.filter((item: any) =>
            item.data.nombre.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 
            || item.data.cod_tercer.toLowerCase().indexOf(searchKey.toLowerCase()) > -1));
    }


    getBookings() {
        return Promise.resolve(this.bookings);
    }
    getFactura() {
        return Promise.resolve(this.factura);
    }

    //adiciona un item a factura
    addfactura(item) {
        console.log('add item factura item llega:', item);
        this.facturaCounter = this.facturaCounter + 1;
        let exist = false;

        if (this.factura && this.factura.length > 0) {
            this.factura.forEach((val, i) => {
                if (val.item.cod_refinv === item.cod_refinv) {
                    exist = true;
                }
            });
        }

        if (!exist) {
            this.factura.push({ id: this.facturaCounter, item: item });
        }
        console.log('Factura lista :', this.factura);
        
        return Promise.resolve();
    }


    //saca un elemento de la factura
    borraritemfactura(item) {
        let index = this.factura.indexOf(item);
        if (index > -1) {
            this.factura.splice(index, 1);
        }
        return Promise.resolve();
    }

    //retorna array reciobo de caja
    getRecibocaja() {
        return Promise.resolve(this.recibocaja);
    }

    //adiciona un item a factura
    addrecibocaja(item) {
        console.log('add item recibio item llega:', item);
        this._cliente.chequeacliente();
        this.recibocajaCounter = this.recibocajaCounter + 1;
        let exist = false;

        if (this.recibocaja && this.recibocaja.length > 0) {
            this.recibocaja.forEach((val, i) => {
                if (val.item.num_obliga === item.num_obliga) {
                    exist = true;
                }
            });
        }

        if (!exist) {
            this.recibocaja.push({ id: this.recibocajaCounter, item: item });
        }
        console.log('REcibo lista :', this.recibocaja);
        
        return Promise.resolve();
    }


    //saca un elemento de Recibo de caja
    borraritemrecibocaja(item) {
        let index = this.recibocaja.indexOf(item);
        if (index > -1) {
            this.recibocaja.splice(index, 1);
        }
        return Promise.resolve();
    }

}