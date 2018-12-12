import { Injectable } from '@angular/core';
import messages from './mock-messages';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { VisitasProvider } from '../visitas/visitas.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageCounter: number = 0;
  messages: Array<any> = messages;
  // messages: Array<any> ;

  constructor(private fbDb: AngularFirestore,
    public _visitas: VisitasProvider,
    ) {

  }
  //Obtiene mensajes de la ruta
  public getdbDbmensajes(idRuta) {
    // return this.fbDb.collection('manfechas').snapshotChanges();
    console.log('getdbDbmensajes idRura:', idRuta);
    return this.fbDb.collection('mensajes', ref => ref.where('id_ruta', '==', idRuta)).valueChanges();
  }  

  findById(id) {
    return Promise.resolve(this.messages[id - 1]);
  }

  cargaMessages() {
    // console.log('getMessages id ruta:', this._visitas.id_ruta)
    // this.getdbDbmensajes(this._visitas.id_ruta).subscribe((datos: any) => {
    //   console.log('En getMessages 1 datos:', datos);                
    //   if (datos) {
    //       console.log('En getMessages 2');
    //       console.log('obtuvo getMessages datos:', datos);
    //       this.messages = datos;
    //   } 
    // });
    
  }

  getMessages() {
    console.log('getMessages id ruta:', this.messages)
      return this.messages;
    
  }

  message(message) {
    this.messageCounter = this.messageCounter + 1;
    this.messages.push({id: this.messageCounter, message: message});
    return Promise.resolve();
  }

  getItem(id) {
    for (var i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id === parseInt(id)) {
        return this.messages[i];
      }
    }
    return null;
  }

  delMessage(message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }
}
