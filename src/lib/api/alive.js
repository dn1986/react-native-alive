import axios from 'axios';
import queryString from 'query-string';

const apiUrl = 'http://13.209.97.198/api';

export const itemList = ({mode, level, parent}) => axios.get(`${apiUrl}/itemList?${queryString.stringify({mode, level, parent})}`);
export const itemAdd = ({mode, level, parent, name}) => axios.post(`${apiUrl}/itemAdd`, queryString.stringify({mode, level, parent, name}));
export const itemDel = ({mode, itemNo}) => axios.delete(`${apiUrl}/itemDel?${queryString.stringify({mode, itemNo})}`);
export const aliveAdd = (formData) => axios.post(`${apiUrl}/aliveAdd`, formData, {headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
}});