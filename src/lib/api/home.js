import axios from 'axios';
import queryString from 'query-string';

const apiUrl = 'http://13.209.97.198/api';

export const aliveList = (currentCount) => axios.get(`${apiUrl}/aliveList?${queryString.stringify({currentCount})}`);
export const aliveOne = (no) => axios.get(`${apiUrl}/aliveOne?no=${no}`);
export const aliveLike = (no) => axios.post(`${apiUrl}/aliveLike`, queryString.stringify({no}));
export const aliveNew = () => axios.get(`${apiUrl}/aliveNew`);
export const aliveDel = (no) => axios.post(`${apiUrl}/aliveDel`, queryString.stringify({no}));