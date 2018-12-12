import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ParEmpreService } from '../providers/par-empre.service';
import { NetsolinApp } from '../shared/global';
import { NavController, Platform, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})

export class CarritoFacturaService {

  items:any[] = [];
  total_carrito:number = 0;
  ordenes:any[] = [];

  

  constructor( private alertCtrl:AlertController,
               private platform: Platform,
               private modalCtrl:ModalController,
               private storage:Storage,               
              //  private _us:UsuarioService 
) {

    this.cargar_storage();
    this.actualizar_total();
  }

  remove_item( idx:number ){

    this.items.splice(idx,1);
    this.actualizar_total();
    this.guardar_storage();

  }

  realizar_factura(){

    // let data = new URLSearchParams();
    // let cod_refven:string[]=[];

    // for( let item of this.items ){
    //   cod_refven.push( item.cod_refven );
    // }
    // console.log('realizar_pedido');
    // console.log(cod_refven);
    // data.append("items", cod_refven.join(","));
    // console.log(cod_refven.join(","));
  

  }



  ver_carrito_factura(){

    // let modal:any;
    // console.log("en ver_carrito factura");
    //   modal = this.modalCtrl.create( CarritoPage );

    // modal.present();

    // modal.onDidDismiss(  (abrirCarrito:boolean)=>{

    //   console.log(abrirCarrito);

    //   if( abrirCarrito ){
    //     this.modalCtrl.create( CarritoPage ).present();
    //   }

    // })

  }



  agregar_carrito_factura(item_parametro:any ){
  console.log('carrito factura items', this.items);
  console.log('carrito item_parametro ', item_parametro);
    for( let item of this.items ){
      if( item.cod_refven === item_parametro.cod_refven ){
        this.alertCtrl.create({
          header: 'Error',
          subHeader: 'Item existe',
          message: item_parametro.nombre_corto + ", ya se encuentra en su lista",
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }
  }

    this.items.push(item_parametro)
    this.actualizar_total();
    this.guardar_storage();

    for( let item of this.items ){
      if( item.cod_refven !== item_parametro.cod_refven ){
        this.alertCtrl.create({
          header: 'Resultado',
          subHeader: 'Item agregado',
          message: item_parametro.nombre_corto + ", se agrego en su lista",
          buttons: ['OK']
        }).then(alert => alert.present());        
        return;
      }
  }


  }


  actualizar_total(){

    this.total_carrito = 0;
    for( let item of this.items ){
      this.total_carrito += Number(item.precio)
    ;
      console.log("SUMA")
      console.log (this.total_carrito)
    }

  }


  private guardar_storage(){

    if( this.platform.is("cordova") ){
      // dispositivo
      this.storage.set('items', this.items );

    }else{
      // computadora
      localStorage.setItem("items", JSON.stringify( this.items ) );

    }


  }

  cargar_storage(){

    let promesa = new Promise( ( resolve, reject )=>{

      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.ready()
                  .then( ()=>{

                  this.storage.get("items")
                          .then( items =>{
                            if( items ){
                              this.items = items;
                            }
                            resolve();
                        })

              })


      }else{
        // computadora
        if( localStorage.getItem("items") ){
          //Existe items en el localstorage
          this.items = JSON.parse( localStorage.getItem("items")  );
        }

        resolve();

      }

    });

    return promesa;

  }




 

}
