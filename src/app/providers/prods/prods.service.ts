import { Injectable } from '@angular/core';
import { NetsolinApp } from '../../shared/global';
import { ParEmpreService } from '../par-empre.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ItemFact } from '../../interfaces/interfaces.generales';

@Injectable({
  providedIn: 'root'
})

export class ProdsService {
  private prods: any;
  cargoInventarioNetsolin = false;
  inventario: Array<any> = [];
  facturaCounter: number = 0;
  factura: Array<any> = [];
  itemFact: ItemFact;
  bodega = 'VEH';

  constructor(public _parempre: ParEmpreService,
    private fbDb: AngularFirestore,
    private http: HttpClient,
    ) {
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
   buscarProducto(searchKey: string) {

    console.log('buscarProducto searchKey:', searchKey);
    let key: string = searchKey.toUpperCase();
    console.log('buscarProducto key:', key);
    console.log(this.inventario);
     return Promise.resolve(this.inventario.filter((item: any) =>
        item.cod_refinv.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 
        || item.nombre.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 ));
}

  getAll() {
    return this.prods;
  }

  getProd(id) {
    for (let i = 0; i < this.inventario.length; i++) {
      if (this.inventario[i].cod_refinv === id) {
        return this.inventario[i];
      }
    }
    return null;
  }


  getItem(id) {
    for (let i = 0; i < this.prods.length; i++) {
      if (this.prods[i].id === parseInt(id)) {
        return this.prods[i];
      }
    }
    return null;
  }

  getCar(prodshopID, prodID) {
    let prodshop = this.getItem(prodshopID);

    for (let i = 0; i < prodshop.prods.length; i++) {
        if (prodshop.cars[i].id === parseInt(prodID)) {
            return prodshop.cars[i];
        }
    }

    return null;
}  

  remove(item) {
    this.prods.splice(this.prods.indexOf(item), 1);
  }


 //adiciona un item a factura
 addfactura(item, cantidad) {
  console.log('add item factura item llega:', item);
  this.facturaCounter = this.facturaCounter + 1;
  let exist = false;

  if (this.factura && this.factura.length > 0) {
      this.factura.forEach((val, i) => {
          if (val.item.cod_ref === item.cod_refinv) {
              val.item.cantidad = cantidad;
              val.item.total = val.item.precio * cantidad;
              exist = true;
          }
      });
  }

  if (!exist) {
    const itemAdi =  {
      cod_ref: item.cod_refinv,
      nombre: item.nombre,
      precio: item.precio_ven,
      cantidad: cantidad,
      por_iva: item.por_iva,
      total: item.precio_ven * cantidad
    };
    // this.itemFact.cod_ref = item.cod_refinv;
    // this.itemFact.nombre = item.nombre;
    // this.itemFact.precio = item.precio_ven;
    // this.itemFact.cantidad = cantidad;
    // this.itemFact.por_iva = item.por_iva;
    // this.itemFact.total = item.precio_ven * cantidad;
    console.log('Item a adicionar:', itemAdi);
      this.factura.push({ id: this.facturaCounter, item: itemAdi });
  }
  console.log('Factura lista :', this.factura);
  
  return Promise.resolve();
}
getFactura() {
  return Promise.resolve(this.factura);
}
    //saca un elemento de la factura
    borraritemfactura(item) {
      let index = this.factura.indexOf(item);
      if (index > -1) {
          this.factura.splice(index, 1);
      }
      return Promise.resolve();
  }
getitemFactura(id) {
  for (let i = 0; i < this.factura.length; i++) {
    if (this.factura[i].item.cod_ref === id) {
      return this.factura[i].item;
    }
  }
  return null;
}

}
