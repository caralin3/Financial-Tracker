import { SetCurrentUserAction } from '../reducers';

export interface Action<T, Payload> {
  type: T,
  payload: Payload,
}

export enum TypeKeys {
  SET_CURRENT_USER = 'SET_CURRENT_USER',
}

export type ActionTypes = SetCurrentUserAction;