import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import { Map, List } from 'immutable';
import * as AliveAPI from 'lib/api/alive';

// action type
const ITEM_LIST = 'alive/ITEM_LIST';
const ITEM_ADD = 'alive/ITEM_ADD';
const ITEM_DEL = 'alive/ITEM_DEL';
const ITEM_SELECT = 'alive/ITEM_SELECT';
const ITEM_RESET = 'alive/ITEM_RESET';
const ITEM_CHANGE = 'alive/ITEM_CHANGE';

const ALIVE_ADD = 'alive/ALIVE_ADD';
const ALIVE_ITEM_ADD = 'alive/ALIVE_ITEM_ADD';
const ALIVE_ITEM_DEL = 'alive/ALIVE_ITEM_DEL';
const ALIVE_ITEM_RESET = 'alive/ALIVE_ITEM_RESET';

// action creators
export const itemList = createAction(ITEM_LIST, AliveAPI.itemList);
export const itemAdd = createAction(ITEM_ADD, AliveAPI.itemAdd);
export const itemDel = createAction(ITEM_DEL, AliveAPI.itemDel);
export const itemSelect = createAction(ITEM_SELECT);
export const itemReset = createAction(ITEM_RESET);
export const itemChange = createAction(ITEM_CHANGE);

export const aliveAdd = createAction(ALIVE_ADD, AliveAPI.aliveAdd);
export const aliveItemAdd = createAction(ALIVE_ITEM_ADD);
export const aliveItemDel = createAction(ALIVE_ITEM_DEL);
export const aliveItemReset = createAction(ALIVE_ITEM_RESET);

// initial state
const initialState = Map({
    itemList: List(),   // 선택 가능한 아이템 목록
    aliveItem: List(),  // 단계별(5w1h) 선택한 아이템 목록
    exist: null,        // 아이템 등록 시 존재 여부
    count: 0,           // 아이템 삭제 시 사용 횟수
    result: false,      // Alive 등록 결과
    itemInfo: Map({
        itemNo: '',
        mode: 'w1',
        name: '',
        level: '1',
        parent: ''
    })
})

// reducer
export default handleActions({
    ...pender({
        type: ITEM_LIST,
        onSuccess: (state, action) => {
            const { itemList } = action.payload.data;
            return state.set('itemList', itemList);
        }
    }),
    ...pender({
        type: ITEM_ADD,
        onSuccess: (state, action) => {
            return state.set('exist', action.payload.data.exist);
        }
    }),
    ...pender({
        type: ITEM_DEL,
        onSuccess: (state, action) => {
            return state.set('count', action.payload.data.count);
        }
    }),
    [ITEM_SELECT]: (state, action) => {
        const index1 = state.get('itemList').findIndex((item, idx) => {
            return item.itemNo === action.payload
        });

        const index2 = state.get('itemList').findIndex((item, idx) => {
            return item.useYn === 'Y'
        });
        
        if(index1 !== index2){
            return state.updateIn(['itemList', index1, 'useYn'], useYn => (useYn === null || useYn === 'N') ? 'Y' : 'N')
                .updateIn(['itemList', index2, 'useYn'], useYn => (useYn === null || useYn === 'N') ? 'Y' : 'N');
        }else{
            return state.updateIn(['itemList', index1, 'useYn'], useYn => (useYn === null || useYn === 'N') ? 'Y' : 'N')
        }
    },
    [ITEM_RESET]: (state, action) => {
        return state.set('exist', null).set('count', 0).set('result', false);
    },
    [ITEM_CHANGE]: (state, action) => {
        return state.set('itemInfo', action.payload);
    },
    ...pender({
        type: ALIVE_ADD,
        onSuccess: (state, action) => {
            return state.set('result', true);
        }
    }),
    [ALIVE_ITEM_ADD]: (state, action) => {
        const { item, index, replace } = action.payload;
        if(replace){
            // UPDATE
            return state.setIn(['aliveItem', index], {
                itemNo: item.itemNo,
                level: item.level,
                mode: item.mode,
                name: item.name,
                parent: item.parent,
                childCnt: item.childCnt
            }).set('itemInfo', {
                itemNo: item.itemNo,
                mode: item.mode,
                name: item.name,
                level: parseInt(item.level, 10) + 1,
                parent: item.parent,
            });
        }else{
            // ADD
            return state.update('aliveItem', aliveItem => 
                aliveItem.push(
                    {
                        itemNo: item.itemNo,
                        level: item.level,
                        mode: item.mode,
                        name: item.name,
                        parent: item.parent,
                        childCnt: item.childCnt
                    }
                )
            ).set('itemInfo', {
                itemNo: item.itemNo,
                mode: item.mode,
                name: item.name,
                level: parseInt(item.level, 10) + 1,
                parent: item.parent,
            });
        }
    },
    [ALIVE_ITEM_DEL]: (state, action) => {
        return state.deleteIn(['aliveItem', parseInt(state.get('aliveItem').size, 10) - 1]);
    },
    [ALIVE_ITEM_RESET]: (state, action) => {
        return state.update('aliveItem', aliveItem => 
            aliveItem.clear()
        );
    }
}, initialState)