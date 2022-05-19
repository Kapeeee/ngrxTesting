import { createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
  user: Usuario | any;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(
  initialState,

  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unSetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state: any, action: any) {
  return _authReducer(state, action);
}
