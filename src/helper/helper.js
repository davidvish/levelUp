import {launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { OAuthSettingsLms } from '../assets/json/CloudOAuthSettings';
import { getCompanyId } from '../utils/authentication';

export const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    let timeStr = '';
    if (hrs > 0) {
      timeStr += `${hrs.toString().padStart(2, '0')}h:`;
    }
    timeStr += `${mins.toString().padStart(2, '0')}m:${secs
      .toString()
      .padStart(2, '0')}s`;
    return timeStr;
  };


 