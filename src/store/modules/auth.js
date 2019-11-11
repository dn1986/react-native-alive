import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import { Map } from 'immutable';
import * as AuthAPI from 'lib/api/auth';

// action type
const CHANGE_INPUT = 'auth/CHANGE_INPUT';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';
const CHECK_EMAIL_EXISTS = 'auth/CHECK_EMAIL_EXISTS';
const SET_ERROR = 'auth/SET_ERROR';
const SIGNUP = 'auth/SIGNUP';
const LOGIN = 'auth/LOGIN';
const LOGOUT = 'auth/LOGOUT';

// action creators
export const changeInput = createAction(CHANGE_INPUT);
export const initializeForm = createAction(INITIALIZE_FORM);
export const checkEmailExists = createAction(CHECK_EMAIL_EXISTS, AuthAPI.checkEmailExists);
export const setError = createAction(SET_ERROR);
export const signup = createAction(SIGNUP, AuthAPI.signup);
export const login = createAction(LOGIN, AuthAPI.login);
export const logout = createAction(LOGOUT, AuthAPI.logout);

// initial state
const initialState = Map({
    signup: Map({
        form: Map({
            email: '',
            password: ''
        }),
        exists: Map({
            email: false
        }),
        error: null
    }),
    login: Map({
        form: Map({
            email: '',
            password: ''
        }),
        error: null
    }),
    result: Map({})
});

// reducer
export default handleActions({
    [CHANGE_INPUT]: (state, action) => {
        const { form, name, text } = action.payload;
        return state.setIn([form, 'form', name], text);
    },
    [INITIALIZE_FORM]: (state, action) => {
        const initialForm = initialState.get(action.payload);
        return state.set(action.payload, initialForm);
    },
    [SET_ERROR]: (state, action) => {
        const { form, message } = action.payload;
        return state.setIn([form, 'error'], message);
    },
    ...pender({
        type: LOGIN,
        onSuccess: (state, action) => state.set('result', Map(action.payload.data))
    }),
    ...pender({
        type: SIGNUP,
        onSuccess: (state, action) => state.set('result', Map(action.payload.data))
    }),
    ...pender({
        type: CHECK_EMAIL_EXISTS,
        onSuccess: (state, action) => state.setIn(['signup', 'exists', 'email'], action.payload.data.exists)
    })
}, initialState)