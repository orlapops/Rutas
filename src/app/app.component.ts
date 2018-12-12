import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateProvider } from './providers/translate/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

import { Pages } from './interfaces/pages';
import { ParEmpreService } from './providers/par-empre.service';
import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appPages: Array<Pages>;
  // public listing;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateProvider,
    private translateService: TranslateService,
    public _parEmpreProv: ParEmpreService,
    private auth: AuthService ,
    public navCtrl: NavController
  ) {
    this.appPages = [
      {
        title: 'Inicio',
        url: '/home',
        direct: 'root',
        icon: 'home'
      },
      {
        title: 'Recibo Caja',
        url: '/recibocaja',
        direct: 'forward',
        icon: 'book'
      },
      {
        title: 'Factura',
        url: '/factura',
        direct: 'forward',
        icon: 'list'
      },
      // {
      //   title: 'Rent a Car',
      //   url: '/rentcar',
      //   direct: 'forward',
      //   icon: 'car'
      // },
      // {
      //   title: 'Trip Activities',
      //   url: '/activities',
      //   direct: 'forward',
      //   icon: 'beer'
      // },
      // {
      //   title: 'Local Weather',
      //   url: '/local-weather',
      //   direct: 'forward',
      //   icon: 'partly-sunny'
      // },
      {
        title: 'Acerca de',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      },
      {
        title: 'Soporte',
        url: '/support',
        direct: 'forward',
        icon: 'help-buoy'
      }
    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Set language of the app.
      this.translateService.setDefaultLang(environment.language);
      this.translateService.use(environment.language);
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations);
      });
      this._parEmpreProv.cargarLicenciaStorage().then( existe => {  
        this.statusBar.styleDefault();
        this.splashScreen.hide();  
        //si existe contnua verificando parametros
        if ( existe ) {
          console.log('cargo licencia URL_SERVICIOS: '+this._parEmpreProv.URL_SERVICIOS);
              //inicializar carga necesaria en home 
              // this._rs.cargaRutaActiva();
              // si debe pedir logeo 
              if (this._parEmpreProv.datoslicencia.util_logeo){
                if(this._parEmpreProv.datoslicencia.logeo_firebase){
                  console.log('app.component 3 util logeo');
                  //version con auth por firebase
                  this.auth.Session.subscribe(session=>{
                    console.log('app.component 4 util logeo');
                    if(session){
                      console.log('app.component 5 util logeo cambiar a homepage');
                      this.navCtrl.navigateRoot('/tabs/(home:home)');
                    }
                    else{
                      console.log('app.component 5 util logeo cambiar a loginpage');
                      this.navCtrl.navigateRoot('/login');
                    }
                  });
                  this.statusBar.styleDefault();
                  this.splashScreen.hide();  
                } else { 
                  //version sin auth por firebase
                  this._parEmpreProv.cargarUsuarioStorage().then( existe => {  
                    console.log('app.component netsolin cargo storage 1');
                    //si existeno necesita volver a pedir logeo va a homepage sino a logeo
                    if ( existe ) {
                      console.log('app.component netsolin cargo storage 3 a tabspage');
                      this.navCtrl.navigateRoot('/home');
                    }else {
                      console.log('app.component netsolin cargo storage 4 a loginpage');
                      this.navCtrl.navigateRoot('/login');
                    }  
                    });
                  }                    
              } else {
                console.log('No utiliza logeo');
                this.navCtrl.navigateRoot('/home');
            }
        }else {
          console.log('No existe datos licencia ir a registrar licencia');
          this.navCtrl.navigateRoot('');
         }  
    });      
    }).catch(() => {
      // Set language of the app.
      this.translateService.setDefaultLang(environment.language);
      this.translateService.use(environment.language);
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations);
      });
    });
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.navCtrl.navigateRoot('login');
  }

}
