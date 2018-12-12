import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { environment } from '../../../environments/environment';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { VisitasProvider } from '../../providers/visitas/visitas.service';
import { HomePage } from '../home/home.page';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visita-list',
  templateUrl: './visita-list.page.html',
  styleUrls: ['./visita-list.page.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('300ms', [animate('600ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class VisitaListPage implements OnInit {
  visitaLists: String = 'linelist';
  agmStyles: any[] = environment.agmStyles;
  visitas: any;
  textbus = '';
  fechainibus: any;
  fechafinbus: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private translate: TranslateProvider,
    public _visitas: VisitasProvider,
    public _pagehome: HomePage
    // public visitaService: VisitasProvider
  ) {
    // this.visitas = this.visitaService.getAll();
    this.textbus = this.route.snapshot.paramMap.get('textbus');
    this.fechainibus = this.route.snapshot.paramMap.get('fini');
    this.fechafinbus = this.route.snapshot.paramMap.get('ffin');
    console.log('param leido llega ', this.textbus, this.fechainibus, this.fechafinbus);
    this.visitas = this._visitas.visitaTodas.filter((item: any) =>
            item.data.cod_tercer.toLowerCase().indexOf(this.textbus.toLowerCase()) > -1 
            || item.data.nombre.toLowerCase().indexOf(this.textbus.toLowerCase()) > -1 );  
  }

  ngOnInit() {
    console.log('ngOnInit visita-list 1 a buscar' , HomePage);
    console.log('ngOnInit visita-list home checkin', this._pagehome.checkin );
    console.log('ngOnInit visita-list home ', this._pagehome.checkin  );
    console.log('ngOnInit visita-list home visitalocation', this._pagehome.visitalocation  );
    // let lbusq: any;
    // let lbusq1: any;
    // this._visitas.findByCliente('FONTEX').then(lbusq => {
    //   console.log('lo buscado FONTEX: ' , lbusq);
    // });
    // this._visitas.findByCliente('exito').then(lbusq => {
    //   console.log('lo buscado exito: ' , lbusq);
    // });
    // this._visitas.findByCliente('almacen').then(lbusq => {
    //   console.log('lo buscado almacen: ' , lbusq);
    // });
    // this._visitas.findByCliente('36273305').then(lbusq => {
    //   console.log('lo buscado 36273305 ' , lbusq);
    // });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    
  }

}
