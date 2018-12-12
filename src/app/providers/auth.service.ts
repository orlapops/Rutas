import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth :  AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }


    // Registro de usuario
    registerUser(email:string, password:string){
        return this.afAuth.auth.createUserWithEmailAndPassword( email, password)
        .then((res)=>{
         // El usuario se ha creado correctamente.
        })
        .catch(err=>Promise.reject(err))
     }  
 // Login de usuario
 loginUser(email:string, password:string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user=>Promise.resolve(user))
      .catch(err=>Promise.reject(err))
  }
  
// Devuelve la session
  get Session(){
    return this.afAuth.authState;
   }  
 // Logout de usuario
  logout(){
    this.afAuth.auth.signOut().then(()=>{
      // hemos salido
    })
  }   
}