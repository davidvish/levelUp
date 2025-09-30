import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTHENTICATION_STORAGE_KEY = 'token';
const USER_ID_STORAGE_KEY = 'user_id';
const PROMO_CODE = 'promoCode';
const FCM_TOKEN = 'fcmToken';
const FCM_NOTIFICATION = 'fcmNotification';
const LANGUAGE = 'language';
const COMPANYID = 'companyId'


// globalVariables.js
let globalVariables = {
  key1: '',
  key2: ''
};

export const setValue = (key, value) => {
  globalVariables[key] = value;
};

export const getValue = (key) => globalVariables[key];

export const clearValue = (key) => {
  globalVariables[key] = '';
};

export const clearAll = () => {
  globalVariables = {
    key1: '',
    key2: ''
  };
};

// token
export function getAuthenticationToken() {
  return AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setAuthenticationToken(token) {
  return AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export async function clearAuthenticationToken() {
  return AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}

// user id
export function getUserId() {
  return AsyncStorage.getItem(USER_ID_STORAGE_KEY);
}

export async function setUserId(token) {
  return AsyncStorage.setItem(USER_ID_STORAGE_KEY, token);
}

export async function clearUserId() {
  return AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
}

// for promocode

export function getPromoCode() {
  return AsyncStorage.getItem(PROMO_CODE);
}
export async function setPromoCode(code) {
  return AsyncStorage.setItem(PROMO_CODE, code);
}
export async function clearPromoCode() {
  return AsyncStorage.removeItem(PROMO_CODE);
}

// fcm token
export async function setFcmToken(token) {
  return AsyncStorage.setItem(FCM_TOKEN, token);
}
export function getFcmToken() {
  return AsyncStorage.getItem(FCM_TOKEN);
}
export async function setFcmNotification(notification) {
  return AsyncStorage.setItem(FCM_NOTIFICATION, notification);
}
export function getFcmNotification() {
  return AsyncStorage.getItem(FCM_NOTIFICATION);
}
export async function clearFcmNotification() {
  return AsyncStorage.removeItem(FCM_NOTIFICATION);
}

// language
export function getLanguage() {
  return AsyncStorage.getItem(LANGUAGE);
}

export async function setLanguage(language) {
  return AsyncStorage.setItem(LANGUAGE, language);
}

export async function clearLanguage() {
  return AsyncStorage.removeItem(LANGUAGE);
}

export async function setCompanyId(companyId) {
  return AsyncStorage.setItem(COMPANYID, companyId);
}

export async function getCompanyId() {
  return AsyncStorage.getItem(COMPANYID);
}