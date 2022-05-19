import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import 'firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, public afs: AngularFirestore) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((firebaseUser) => {
      console.log(firebaseUser);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }: any) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.afs.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  iniciarSesion(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  logOut() {
    return this.afAuth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
