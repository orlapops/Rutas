import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { VisitasProvider } from '../../providers/visitas/visitas.service';
import { ParEmpreService } from '../../providers/par-empre.service';

@Component({
  selector: 'app-recibocaja',
  templateUrl: './recibocaja.page.html',
  styleUrls: ['./recibocaja.page.scss'],
})

export class RecibocajaPage implements OnInit {
  recibocaja: Array<any> = [];

  constructor(
    public _parEmpre: ParEmpreService,
    public navCtrl: NavController,
    private translate: TranslateProvider,
    public _visitas: VisitasProvider,
  ) { }

  ngOnInit() {
    this.getRecibocaja();
  }

  deleteItem(item) {
    this._visitas.borraritemrecibocaja(item)
      .then(() => {
        this.getRecibocaja();
      })
      .catch(error => alert(JSON.stringify(error)));
  }

  getRecibocaja() {
    this._visitas.getRecibocaja()
      .then(data => {
        console.log('Recibo data', data);
         this.recibocaja = data; });
  }

}

