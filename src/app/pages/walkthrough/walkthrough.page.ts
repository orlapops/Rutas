import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Slides, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})

export class WalkthroughPage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  showSkip = true;
  slideOpts = {
    effect: 'flip',
    speed: 1000
  };
  dir: string = 'ltr';

  slideList: Array<any> = [
    {
      title: 'Que es Netsolin Movil<strong>Booking</strong>?',
      description: 'Netsolin Erp Movil, le permite tener la empresa en cualquier lugar.',
      image: 'assets/img/netsolin-logo3.png',
    },
    {
      title: 'Consulte su ruta.',
      description: 'Vea el recorrido programado y registre la visita, registre clientes potenciales.',
      image: 'assets/img/hotel-sp02.png',
    },
    {
      title: 'Consultas directas!',
      description: 'Inventario actualizado, cartera de clientes visitasdos, seguimientos.',
      image: 'assets/img/hotel-sp03.png',
    },
    {
      title: 'Genere operaciones!',
      description: 'Realize pedidos, facturas, recibos de caja, registre cambios y devoluciones.',
      image: 'assets/img/hotel-sp03.png',
    },
    {
      title: 'Sincronice con Netsolin Erp!',
      description: 'Las operaciones registradas seran registradas directamente en el Erp de forma que se ahorre tiempos y errores.',
      image: 'assets/img/hotel-sp03.png',
    }
  ];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public router: Router
  ) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  onSlideNext() {
    this.slides.slideNext(1000, false);
  }

	onSlidePrev() {
    this.slides.slidePrev(300);
  }

  // onLastSlide() {
  // 	this.slides.slideTo(3, 300)
  // }

  openHomePage() {
    this.navCtrl.navigateRoot('/home');
    // this.router.navigateByUrl('/tabs/(home:home)');
  }

  openLoginPage() {
    // this.navCtrl.navigateForward('/login');
    this.navCtrl.navigateForward('/licencia');
  }

}
