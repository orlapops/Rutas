import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateProvider } from '../../providers';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdsService } from '../../providers/prods/prods.service';

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.page.html',
  styleUrls: ['./prod-detail.page.scss'],
})
export class ProdDetailPage implements OnInit {
  prodshop: any;
  prodID: any = this.route.snapshot.paramMap.get('id');
  cantidad_sol = 0;
  total_t: number;
  prodenFact: any;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private translate: TranslateProvider,
    public prods: ProdsService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    // this.prodshop = this.prods.getItem(this.prodID);
    this.prodshop = this.prods.getProd(this.prodID);
    console.log('ngonit prod detalle ', this.prodshop);
    //traer el registro si esta en lista de lo que se va a facturar
    this.prodenFact = this.prods.getitemFactura(this.prodID);
    if (this.prodenFact){
      this.cantidad_sol = this.prodenFact.cantidad;
      this.total_t = this.prodenFact.total;
    }
  }

  checkout(prodshopID: number, prodID: number) {
    this.navCtrl.navigateForward(`prod-checkout/${prodshopID}/${prodID}`);
  }

  total(){
    this.total_t = 0;
    this.total_t = this.cantidad_sol * this.prodshop.precio_ven;    
    return this.total_t;
  }  

  async addfactura(item) {

    this.prods.addfactura(item, this.cantidad_sol)
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

}
