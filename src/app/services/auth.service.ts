import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import 'firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Firestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.userSubscription = this.afs
          .doc(`${firebaseUser.uid}/usuario`)
          .valueChanges()
          .subscribe((firebaseUser: any) => {
            const user = Usuario.fromFirebase(firebaseUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscription.unsubscribe();
      }

      // [this.store.dispatch( authActions.setUser())];
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
