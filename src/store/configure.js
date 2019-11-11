import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import penderMiddleware from 'redux-pender';
import * as modules from './modules';

const logger = createLogger();
const reducers = combineReducers(modules);
const middleware = applyMiddleware(logger, penderMiddleware());
const configure = () => createStore(reducers, middleware);

export default configure;