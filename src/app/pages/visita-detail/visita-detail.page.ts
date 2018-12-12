import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { ActivatedRoute, Router } from '@angular/router';

import { ImagePage } from './../modal/image/image.page';

import { environment } from '../../../environments/environment'
import { VisitasProvider } from '../../providers/visitas/visitas.service';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { ParEmpreService } from '../../providers/par-empre.service';
import { ClienteProvider } from '../../providers/cliente.service';
import { ProdsService } from '../../providers/prods/prods.service';

@Component({
  selector: 'app-visita-detail',
  templateUrl: './visita-detail.page.html',
  styleUrls: ['./visita-detail.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('300ms', [animate('600ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class VisitaDetailPage implements OnInit {
  visita: any;
  visitaID: any = this.route.snapshot.paramMap.get('id'); 
  agmStyles: any[] = environment.agmStyles;
  visitaSegment: string = 'details';
  estadoVisita: string = '';
  cargoCartera = false;
  buscar_item:string;
  q: any;
  productos_bus: any;
  searching: any = false;

  constructor(
    public _parEmpre: ParEmpreService,
    public _cliente: ClienteProvider,
    public navCtrl: NavController,
    public asCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private translate: TranslateProvider,
    public _visitas: VisitasProvider,
    public _prods: ProdsService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    console.log('constructor detalle visita');
    console.log(this.visitaID);
    this.visita = this._visitas.getItem(this.visitaID);
    this._visitas.inicializarVisitaActual(this.visitaID);
    // this._visitas.cargaCarteraNetsolin(this.visita.data.cod_tercer).then(cargo =>{
    //     console.log('en detalle visita cargo cartera');
    //     console.log(cargo);
    //     this.cargoCartera = true;
    // })
    // .catch(() => {
    //   console.log('error en carga cartera visita activa');
    // });
  //   console.log(this.visita);
  //   this._visitas.getIdRegVisita(this.visita.id).subscribe((datos: any) => {
  //     console.log('En cargaVisitaActiva 1 datos:');
  //     console.log(datos);
  //     console.log('En cargaVisitaActiva 1.1 datos:');
  //     if (datos) {
  //         console.log('En cargaVisitaActiva 2');
  //         console.log('obtuvo visita actual datos:');
  //         console.log(datos);
  //         datos.cartera = this._visitas.cartera;
  //         this._visitas.visita_activa = datos;
  //         this._visitas.guardarVsita(this.visita.id, this._visitas.visita_activa).then(res => {
  //             console.log('Visita guardada');
  //         })
  //     } else {
  //         console.log('En cargaVisitaActiva 3');
  //         console.log('no se ha creado la visita en reg_visitas');
  //         const fh = Date.now();
  //         const visitaadd = {
  //             datosgen : this.visita.data,
  //             estado : '',
  //             fechahora_ingreso : fh,
  //             cartera : this._visitas.cartera
  //         };
  //         this._visitas.guardarVsita(this.visita.id, visitaadd).then(res => {
  //             console.log('Visita guardada');
  //         })        
  //     }
  // });    


  }

  ngOnInit() {
    console.log('ngoniit visita detalle');
    console.log(this.visita);
  }
 

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async addfactura(item) {

    this._visitas.addfactura(item)
      .then(async property => {
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          message: 'Item adicionado a la factura.',
          duration: 2000,
          position: 'bottom'
        });

        toast.present();
      });
  }

  async addrecibocaja(item) {

    this._visitas.addrecibocaja(item)
      .then(async property => {
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          message: 'Item adicionado a Recibo.',
          duration: 2000,
          position: 'bottom'
        });

        toast.present();
      });
  }

  registrarIngresoVisita() {
    this.estadoVisita = 'A';
    this._visitas.visita_activa.estado = 'A';
    this._visitas.guardarVsita(this.visitaID, this._visitas.visita_activa);
  }

  cerrarVisita() {
    this.estadoVisita = 'C';
  }
  actualizarGps(){

  }

  range(n) {
    return new Array(n);
  }

  avgRating() {
    let average: number = 0;

    this.visita.reviews.forEach((val: any, key: any) => {
      average += val.rating;
    });

    return average / this.visita.reviews.length;
  }

  buscar_productos($event){

    this.q = $event.target.value;
    console.log('buscar_productos: ', this.q );
    this.searching = true;
    // this._visitas.buscarProducto(this.q).then(lbusq => {
    this._prods.buscarProducto(this.q).then(lbusq => {
      console.log('lo buscado por producto: ' , lbusq);
      this.productos_bus = lbusq;
      this.searching = false;
      console.log('lo buscado por producto  this.productos_bus: ' ,  this.productos_bus);

    });    
  //     if (this.q != '') {
  //       this.startAt.next(this.q);
  //       this.endAt.next(this.q + "\uf8ff");
  //     }
  //     else {
  //       this.items = this.all_items;
  //     }
  }


}
