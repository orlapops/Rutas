import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'popmenu',
  templateUrl: './popmenu.component.html',
  styleUrls: ['./popmenu.component.scss']
})
export class PopmenuComponent implements OnInit {
  openMenu: boolean = false;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  } 

  // // //
  settings() {
    this.navCtrl.navigateForward('settings');
  }

  logout() {
    this.navCtrl.navigateRoot('extras');
  }

  register() {
    this.navCtrl.navigateForward('extras');
  }

}
