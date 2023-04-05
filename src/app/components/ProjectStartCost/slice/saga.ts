import { take, call, put, select, takeLatest } from 'redux-saga/effects'; //
import { paymentScheduleActions as actions } from '.';

function* doSomething() {}

export function* paymentScheduleSaga() {
  yield takeLatest(actions.someAction.type, doSomething);
}
