import axios from 'axios';
import queryString from 'query-string';

const apiUrl = 'http://13.209.97.198/api';

export const checkEmailExists = (email) => axios.get(`${apiUrl}/auth/exists?email=${email}`);
export const signup = ({email, password}) => axios.post(`${apiUrl}/auth/signup`, queryString.stringify({ email, password }));
export const login = ({email, password}) => axios.post(`${apiUrl}/auth/login`, queryString.stringify({ email, password }));
export const checkStatus = () => axios.get(`${apiUrl}/auth/check`);
export const share = (shareYn) => axios.post(`${apiUrl}/auth/share`, queryString.stringify({ shareYn }));
export const logout = () => axios.post(`${apiUrl}/auth/logout`);