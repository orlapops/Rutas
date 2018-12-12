import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { ProdsService } from '../../providers/prods/prods.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.page.html',
  styleUrls: ['./factura.page.scss'],
})

export class FacturaPage implements OnInit {
  factura: Array<any> = [];
  total_fact = 0;
  constructor(
    public navCtrl: NavController,
    private translate: TranslateProvider,
    public _prods: ProdsService,
    public route: ActivatedRoute,
    public router: Router


    ) { }

  ngOnInit() {
    this.getFactura();    
  }

  deleteItem(item) {
    this._prods.borraritemfactura(item)
      .then(() => {
        this.getFactura();
      })
      .catch(error => alert(JSON.stringify(error)));
  }

  getFactura() {
    this._prods.getFactura()
      .then(data => {
        console.log('getfavoritos data', data);
         this.factura = data; 
         this.actualizar_totalfact();
        });
  }
  total(item, i){
    console.log('en total item llega:', i, item, this.factura);
    this.factura[i].item.total = this.factura[i].item.cantidad * this.factura[i].item.precio;
    this.actualizar_totalfact();
    // this.total_t = 0;
    // this.total_t = this.cantidad_sol * this.prodshop.precio_ven;    
    // return this.total_t;
  }  
  actualizar_totalfact(){

    this.total_fact = 0;
    for( let itemf of this.factura ){
      this.total_fact += Number(itemf.item.total)
    ;
      console.log("SUMA")
      console.log (this.total_fact)
    }

  }

}


