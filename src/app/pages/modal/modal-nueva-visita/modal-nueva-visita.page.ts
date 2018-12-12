import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController, ModalController } from '@ionic/angular';

declare var google:any;

@Component({
  selector: 'app-modal-nueva-visita',
  templateUrl: './modal-nueva-visita.page.html',
  styleUrls: ['./modal-nueva-visita.page.scss'],
})
export class ModalNuevaVisitaPage implements OnInit {
  @Input() coords: any;
  address: string;
  description: string = '';
  foto: any = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('ionViewDidLoad ModalNuevoSitioPage');
    // this.coords.lat = this.navParams.get('lat');
    // this.coords.lng = this.navParams.get('lng');
    this.getAddress(this.coords).then(results=>{
      console.log('ngoninit nueva visita modal');
      console.log(results);
      this.address = results[0]['formatted_address'];      
    },errStatus=>{
      //Aqui codigo manejo error
    })

  }
  getAddress(coords):any{
    var geocoder = new google.maps.Geocoder();

    return new Promise(function(resolve,reject){
      geocoder.geocode({'location':coords},function(results,status){
        //llamado asincronicamente
        if(status == google.maps.GeocoderStatus.OK){
          resolve(results);
        } else {
          reject(status);
        }
      })
    })
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  sacarFoto(){

  }
guardarNuevaVisita(){

}
}
