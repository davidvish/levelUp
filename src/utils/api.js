import axios from 'axios';
import {getAuthenticationToken, getLanguage, getUserId, setValue} from './authentication';
import NetInfo from '@react-native-community/netinfo';
import {ENV} from '../config';
import {STRINGS} from '../constants';
import {Alert} from 'react-native';
import { onLogout, refreshTokenFunction } from './commonFunction';
//import { getTokenExpireResponseSuccessAction } from '../container/app/Home/module/action';
//import { useDispatch } from 'react-redux';

//const dispatch = useDispatch();


export function get(path) {
  return apirequest('get', path, undefined);
}

export function post(path, body, formdata) {
  return apirequest('POST', path, body, formdata);
}

export function del(path) {
  return apirequest('DELETE', path, undefined);
}

export function putMethod(path, body, formdata) {
  return apirequest('PUT', path, body, formdata);
}

async function apiRequestHeader(formdata) {
  const token = await getAuthenticationToken();
 // const language = await getLanguage();
  const headers = {
    'Content-Type': formdata ? 'multipart/form-data' : 'application/json',
    // secretkey: ENV.SECRET_KEY,
    // publishkey: ENV.PUBLISH_KEY,
    // lang: language || 'en'
  };
  if (token && token.length > 0) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  } else {
    return {
      ...headers
    };
  }
}

async function apirequest(method, path, body, formdata) {
  try {
    const endpoint = ENV.BASE_URL + path;
    const headers = await apiRequestHeader(formdata);
    const options = {
      url: endpoint,
      method,
      headers,
      data: body,
      //timeout: 120000
    };
    console.log('🚀  file: api.js:142  apirequest ~ options', options);
    const networkStatus = await NetInfo.fetch();
    if (networkStatus?.isConnected && networkStatus?.isInternetReachable) {
      const response = await axios(options);
      console.log('response == ', response?.data);
      return response?.data;
    } else {
      let response = {
        message: STRINGS.noIternetMessage
      };
      return response;
    }
  } catch (error) { 
    console.log('catch error?.response?.data?.message', error?.message);
    //if(error?.message == "Request failed with status code 401"){ 
    //   //setValue('key1', error?.message);
     //onLogout(); 
    //   //dispatch(getTokenExpireResponseSuccessAction(error?.message))
   // }
    return error?.response?.data;
  }
}
