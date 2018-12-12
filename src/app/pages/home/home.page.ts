import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, Platform, ModalController, ActionSheetController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ParEmpreService } from '../../providers/par-empre.service';
import { VisitasProvider } from '../../providers/visitas/visitas.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalNuevaVisitaPage } from '../modal/modal-nueva-visita/modal-nueva-visita.page';
import { VisitanService } from '../../providers/visitan.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProdsService } from '../../providers/prods/prods.service';
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit {
  public visitnanList: Observable<any>;
  
  openMenu: Boolean = false;
  searchQuery: String = '';
  items: string[];
  showItems: Boolean = false;
  rooms: any;
  adults: any;

  childs: any = 0;
  children: number;
  // hotellocation: string;
  visitas: any;
  cargovisitas = false;
  visitalocation: string;
  
  agmStyles: any[] = environment.agmStyles;

  // search conditions
  public checkin = {
    name: this.translate.get('app.pages.home.label.checkin'),
    date: new Date().toISOString()
  };

  public checkout = {
    name: this.translate.get('app.pages.home.label.checkout'),
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
  };
  coords : any = { lat: 0, lng: 0 }


  constructor(
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    public _parEmpre: ParEmpreService,
    public platform: Platform,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private translate: TranslateProvider,
    public _visitas: VisitasProvider,
    public _prods: ProdsService,
    private viistaService: VisitanService

    
  ) {

    // this.visitas = this._visitas.cargaRutaActiva();
    console.log('constructor home');
    console.log(this._visitas.visitaTodas);
    platform.ready().then(() => {
      console.log('En constructor home usuario: ' + _parEmpre.usuario.cod_usuar);
      // La plataforma esta lista y ya tenemos acceso a los plugins.        
      this.obtenerPosicion();
    });      
  }

  ngOnInit() {
    console.log('ngOnInit home');
    //para prueba traer de nuevo servicio la visita
  //   this.viistaService.userId = '1014236804';
  //   this.viistaService.cargaPeriodoUsuar(this.viistaService.userId).then(cargo => {
  //     if (cargo) {
  //       console.log('ngOnInit home CARGO cargaPeriodoUsuar');
  //       this.visitnanList = this.viistaService.getVisitasList().valueChanges();
  //       console.log('ngOnInit home CARGO cargaPeriodoUsuar   this.visitnanList :', this.visitnanList );
  //     } else {
  //       console.log('ngOnInit home NO CARGO cargaPeriodoUsuar');
  //     }
  //   })
  //    .catch( error => {
  //     console.log('error en cargaPeriodoUsuar ', error);
  // });

    console.log(this._visitas.visitaTodas);  
    //Actualizar Inventario a Firebase
    const bodega = 'VEH';
    // this._visitas.cargaInventarioNetsolin().then(cargo => {
     this._prods.cargaInventarioNetsolin().then(cargo => {
      //Si carga el inventario lo actualiza en firebase
      if(cargo) {
        console.log('Cargo Inventario de Netsolin');
        const reginv = {
          // inventario : this._visitas.inventario
          inventario : this._prods.inventario
         };
        //  this._visitas.guardarInvdFB(bodega, reginv).then(res => {
         this._prods.guardarInvdFB(bodega, reginv).then(res => {
          console.log('Se guardo el Inventario de Netsolin en firebase');
      })
      } else {
        console.log('No pudo cargar inventario de Netsolin');
      }
    })
    .catch(() => {
      console.log('error en homr ngoniti al cargar visitas');
    });

    //Cargar las visitas
    this._visitas.userId = '1014236804';
    this._visitas.cargaPeriodoUsuar(this._visitas.userId).then(cargo => {
      if (cargo) {
    this._visitas.cargaVisitas().then( cargo => {
      console.log('ngOnInit home 2 luego de cargaVisitas');
      console.log(this._visitas.visitaTodas);    
      console.log(cargo);    
      if(cargo) {
        console.log('ngonit home cargo visitas verdadero');
        this.cargovisitas = true;
      } else {
        console.log('ngonit home cargo visitas falso');
        this.cargovisitas = false;
      }
      })
      .catch(() => {
        console.log('error en homr ngoniti al cargar visitas');
      });
      //Cargar el Inventario de Firebase suscribirse
      // this._visitas.cargaInventariodFB(bodega);
      this._prods.cargaInventariodFB(bodega);
    } else {
      console.log('ngOnInit home NO CARGO cargaPeriodoUsuar');
    }
  })
   .catch( error => {
    console.log('error en cargaPeriodoUsuar ', error);
});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    console.log('ionViewWillEnter  home');
    console.log(this._visitas.visitaTodas);

  }

  initializeItems() {
    this.items = [
      'La Belle Place - Rio de Janeiro',
      'Marshall Hotel - Marshall Islands',
      'Maksoud Plaza - São Paulo',
      'Hotel Copacabana - Rio de Janeiro',
      'Pousada Marés do amanhã - Maragogi'
    ];
  }

  itemSelected(item: string) {
    // this.hotellocation = item;
    this.visitalocation = item;
    this.showItems = false;
  }

  childrenArr(chil) {
    const child = Number(chil);
    this.childs = Array(child).fill(0).map((v, i) => i);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.showItems = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.showItems = false;
    }
  }

  obtenerPosicion(): any {    
    this.geolocation.getCurrentPosition().then(res => {      
      this.coords.lat = res.coords.latitude;      
      this.coords.lng = res.coords.longitude;      
      // this.loadMap(); 
    })
    .catch(      
      (error)=>{         
        console.log(error.message);         
        this.coords.lat = 4.625749001284896;         
        this.coords.lng = -74.078441;         
        // this.loadMap(); 
      }
    )
  }

  async nuevoRegistroVisita() {
    const modal = await this.modalCtrl.create({
      component: ModalNuevaVisitaPage,
      // componentProps: { fromto: fromto, search: this.search }
      componentProps: { coords: this.coords}
    });
    return await modal.present();
  }

  nuevoRegistroVisitssa(){
    console.log('Mostrsr modal');
    //modal para añadir nuevo Visita
    // let mimodal = this.modalCtrl.create('ModalNuevoSitioPage',this.coords);
    // mimodal.present();
  }
  // togglePopupMenu() {
  //   return this.openMenu = !this.openMenu;
  // }
  // // //
  async viewVisitas() {
    console.log('homepage visita-list home checkin', this.checkin );
    console.log('homepage visita-list home ', this.checkin  );
    console.log('homepage visita-list home visitalocation', this.visitalocation  );

    const loader = await this.loadingCtrl.create({
      duration: 1000
    });

    loader.present();
    loader.onWillDismiss().then(() => {
      this.navCtrl.navigateForward(`visita-list/${this.visitalocation}/${this.checkin.date}/${this.checkout.date}`);
      // this.navCtrl.navigateForward(['visita-list', this.visitalocation,this.checkin.date, this.visitalocation, this.checkout.date]);
      // this.router.navigate(['visita-list', 'text buscar']);
      // this.router.navigate(['/bill-detail', billId]);
    });
  }

  editprofile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  settings() {
    this.navCtrl.navigateForward('settings');
  }

  goToWalk() {
    this.navCtrl.navigateRoot('walkthrough');
  }

  logout() {
    this.navCtrl.navigateRoot('login');
  }

  register() {
    this.navCtrl.navigateForward('register');
  }

  messages() {
    this.navCtrl.navigateForward('messages');
  }
  //convertir cadena "20181020" a una fecha 
  convCadenaFecha(cadena){
    let ano = cadena.substr(0,4);
    let mes = cadena.substr(4,2);
    let dia = cadena.substr(6,2);
    let fecha = new Date(ano,mes,dia,0,0,0,0)
    return fecha;
  }


  async moreBillOptions(billId): Promise<void> {
    const action = await this.actionSheetCtrl.create({
      header: 'Modify your bill',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // this.viistaService.removeBill(billId);
          },
        },
        {
          text: 'More details',
          icon: 'play',
          handler: () => {
            // this.router.navigate(['/bill-detail', billId]);
          },
        },
        {
          text: 'Mark as Paid!',
          icon: 'checkmark',
          handler: () => {
            // this.viistaService.payBill(billId);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    action.present();
  }
  

}
