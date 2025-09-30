import {launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { OAuthSettingsLms } from '../assets/json/CloudOAuthSettings';
import { getCompanyId } from '../utils/authentication';

export const pickAndUploadMedia = async (onProgress) => {
  try {
    // Pick a video or image
    const result = await launchImageLibrary({
      mediaType: 'mixed', // 'photo', 'video', or 'mixed'
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log('User cancelled picker');
      return null;
    }

    const file = result.assets[0];
    const fileUri = file.uri;
    const fileName = file.fileName || `file-${Date.now()}`;
    const mimeType = file.type || 'application/octet-stream';

    const storageAccount = OAuthSettingsLms.azureBlobStorageName;
    const containerName = await getCompanyId();
    const sasToken = OAuthSettingsLms.azureBlobStorageSASToken;

    const blobUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;

    let uploadPath = fileUri.replace('file://', '');
    if (fileUri.startsWith('content://')) {
      const stat = await RNFetchBlob.fs.stat(fileUri);
      uploadPath = stat.path;
    }

    const res = await RNFetchBlob.fetch(
      'PUT',
      blobUrl,
      {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': mimeType,
      },
      RNFetchBlob.wrap(uploadPath)
    ).uploadProgress({ interval: 250 }, (written, total) => {
      const percent = Math.floor((written / total) * 100);
      if (onProgress) onProgress(percent);
    });

    if (res.info().status === 201) {
      console.log('Upload successful');
      return `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}`;
    } else {
      console.error('Upload failed', res.info());
      return null;
    }
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
};
