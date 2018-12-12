import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ParEmpreService } from '../providers/par-empre.service';
import { NetsolinApp } from '../shared/global';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// tslint:disable-next-line:no-empty-interface
export interface Icliente {
    cod_tercer: string;
    cliente: string;
    cod_vended: string;
    vendedor: string;
    cod_lista: string;
    lista: string;
    cod_fpago: string;
    for_pago: string;
    inactivo: boolean;
    cartera: Array<any>;
    direcciones: Array<any>;
 }

@Injectable({
  providedIn: 'root'
})

export class ClienteProvider {
    //AQUI CAMBIAR PARA QUE TRAIGA LA BODEGA QUE LE PERTENECE A LA RUTA
    cod_tercer = '';
    clienteactualA: AngularFirestoreDocument<any>;
    public clienteActual: Icliente;    
    public cargo_cliente = false;
    public error_cargacliente = false;
    public men_errorcargacliente = "";
    direcciones: Array<any> = [];
    cargoclienteNetsolin = false;
    
    constructor(private fbDb: AngularFirestore,
        private http: HttpClient,
        // public _message: MessageService,
        public _parempre: ParEmpreService) {
            console.log('en constructor cliente ', this.clienteActual);
    }
    //guarda o actualiza el cliente actual en coleccion clientes de firestore
    public guardarCliente(id){
        console.log('guardarCliente id:' + id);
        console.log(this.clienteActual);
      return this.fbDb.collection('clientes').doc(id).set(this.clienteActual);
    }
    
    chequeacliente(){
      console.log('cheque cliente this.clienteactualA: ', this.clienteactualA);
    }

    //Carga un cliente de Netsolin 
    cargaClienteNetsolin(cod_tercer: string) {
        let promesa = new Promise((resolve,reject)=>{
        // if (this.cargoclienteNetsolin){
        //     console.log('resolve true cargo cargaClienteNetsolin por ya estar inciada');
        //     resolve(true); 
        //  }
          this.clienteActual = null;
          NetsolinApp.objenvrest.filtro = cod_tercer;
          console.log(" cargaClienteNetsolin 1");
          let url= this._parempre.URL_SERVICIOS + "netsolin_servirestgo.csvc?VRCod_obj=CARTEXCLIEAPP";
          console.log(url);
          console.log(NetsolinApp.objenvrest);
          console.log(" cargaClienteNetsolin 2");
          this.http.post( url, NetsolinApp.objenvrest )   
           .subscribe( (data:any) =>{ 
            console.log(" cargaClienteNetsolin 3");
            console.log(data);  
            if( data.error){
                console.log(" cargaClienteNetsolin 31");
              // Aqui hay un problema
               console.log('data.messages');
               console.log(data.menerror);
               this.cargoclienteNetsolin = false;
            //    this.menerror_usuar="Error llamando servicio cargaClienteNetsolin en Netsolin "+data.menerror;
               this.clienteActual = null;
               resolve(false);
              }else{
                console.log(" cargaClienteNetsolin 32");
                console.log(data);
                console.log(data.datos_gen[0]);
                console.log(data.datos_gen[0].cod_tercer);
                this.cargoclienteNetsolin = true;
                // console.log('en llamar cliente por metodo directo fb ', this.clienteActual);
                // this.clienteactualA = this.fbDb.doc(`/clientes/${data.datos_gen[0].cod_tercer}`);
    
                // tslint:disable-next-line:prefer-const
                let clieAux: Icliente;
                // this.menerror_usuar="";
                clieAux = {
                    cod_tercer  : data.datos_gen[0].cod_tercer,
                    cliente : data.datos_gen[0].cliente,
                    cod_fpago : data.datos_gen[0].cod_fpago,
                    for_pago : data.datos_gen[0].for_pago,
                    cod_vended : data.datos_gen[0].cod_vended,
                    vendedor : data.datos_gen[0].vendedor,
                    cod_lista : data.datos_gen[0].cod_lista,
                    lista : data.datos_gen[0].lista,
                    inactivo : data.datos_gen[0].inactivo,
                    cartera : data.cartera,
                    direcciones : data.direcciones
                };
                console.log('Datos traer cargaClienteNetsolin');
                console.log('clieAux: ', clieAux);
                this.clienteActual = clieAux;
                console.log(this.clienteActual);
                resolve(true);
              }
            console.log(" cargaClienteNetsolin 4");
           });
           console.log(" cargaClienteNetsolin 5");
         });
         return promesa;
      }

}
