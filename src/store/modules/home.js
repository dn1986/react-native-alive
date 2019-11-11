import { createAction, handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import * as HomeAPI from 'lib/api/home';

// action type
const ALIVE_LIST = 'home/ALIVE_LIST';
const ALIVE_ONE = 'home/ALIVE_ONE';
const ALIVE_LIKE = 'home/ALIVE_LIKE';
const ALIVE_NEW = 'home/ALIVE_NEW';
const ALIVE_DEL = 'home/ALIVE_DEL';
const ALIVE_RESET = 'home/ALIVE_RESET';
const ALIVE_ONE_RESET = 'hoem/ALIVE_ONE_RESET';

// action creators
export const aliveList = createAction(ALIVE_LIST, HomeAPI.aliveList);
export const aliveOne = createAction(ALIVE_ONE, HomeAPI.aliveOne);
export const aliveLike = createAction(ALIVE_LIKE, HomeAPI.aliveLike);
export const aliveNew = createAction(ALIVE_NEW, HomeAPI.aliveNew);
export const aliveDel = createAction(ALIVE_DEL, HomeAPI.aliveDel);
export const aliveReset = createAction(ALIVE_RESET);
export const aliveOneReset = createAction(ALIVE_ONE_RESET);

// initial state
const initialState = Map({
    aliveList: List([]),
    aliveOne: Map({}),
    aliveNew: Map({}),
    currentCount: 0
})

// reducer
export default handleActions({
    ...pender({
        type: ALIVE_LIST,
        onSuccess: (state, action) => state.update('aliveList',
                aliveList => aliveList.concat(List(action.payload.data.aliveList))).update('currentCount', 
                currentCount => currentCount + action.payload.data.aliveList.length)
    }),
    ...pender({
        type: ALIVE_ONE,
        onSuccess: (state, action) => {
            const index = state.get('aliveList').findIndex((alive, idx) => {
                return alive.no === action.payload.data.alive.no
            });
            return state.set('aliveOne', action.payload.data.alive).updateIn(['aliveList', index, 'viewYn'], viewYn => (viewYn === '0') ? '1' : '1');
        }
    }),
    ...pender({
        type: ALIVE_LIKE,
        onSuccess: (state, action) => {
            return state.updateIn(['aliveOne', 'likeCnt'], (likeCnt) => {
                return likeCnt === '0' ? '1' : '0'
            });
        }
    }),
    ...pender({
        type: ALIVE_NEW,
        onSuccess: (state, action) => state.setIn(['aliveNew', 'count'], action.payload.data.aliveNew)
    }),
    ...pender({
        type: ALIVE_DEL,
        onSuccess: (state, action) => state
    }),
    [ALIVE_RESET]: (state, action) => {
        return state.set('aliveList', List([])).set('currentCount', 0);
    },
    [ALIVE_ONE_RESET]: (state, action) => {
        return state.set('aliveOne', Map({}));
    }
}, initialState)