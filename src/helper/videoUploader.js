import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { OAuthSettingsLms } from '../assets/json/CloudOAuthSettings';
import { getCompanyId } from '../utils/authentication';

export const videoUploader = async (onProgress) => {
  try {
    // 1. Pick a video from gallery
    const video = await ImagePicker.openPicker({
      mediaType: 'video',
    });

    if (!video || !video.path) return null;

    // Convert size (bytes → MB)
    const fileSizeMB = video.size / (1024 * 1024);
    if (fileSizeMB > 200) {
      console.warn(`Video too large: ${fileSizeMB.toFixed(2)}MB (max 200MB)`);
      return null;
    }

    const fileUri = video.path;
    const fileName = `video-${Date.now()}.mp4`; // unique filename
    const mimeType = video.mime || 'video/mp4';

    // 2. Azure Blob details
    const storageAccount = OAuthSettingsLms.azureBlobStorageName;
    const containerName = (await getCompanyId()) || 'default-container';
    const sasToken = OAuthSettingsLms.azureBlobStorageSASToken;

    const blobUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;

    // 3. Upload file
    let uploadPath = fileUri.replace('file://', '');

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

    // 4. Check upload success
    if (res.info().status === 201) {
      return `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}`;
    } else {
      console.error('Upload failed', res.info());
      return null;
    }
  } catch (err) {
    console.error('Video upload error:', err);
    return null;
  }
};
