import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { OAuthSettingsLms } from '../assets/json/CloudOAuthSettings';
import { getCompanyId } from '../utils/authentication';

export const pickAndUpload = async (
  onProgress?: (percent: number) => void
): Promise<string | null> => {
  try {
    const file: DocumentPickerResponse = await DocumentPicker.pickSingle({
      type: [
        types.images,
        types.video,
        types.pdf,
        types.plainText,
        types.audio,
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '*/*',
      ],
    });

    const fileUri = file.uri;
    const fileName = file.name || `file-${Date.now()}`;
    const mimeType = file.type || 'application/octet-stream';

    const storageAccount = OAuthSettingsLms.azureBlobStorageName;
    const containerName = await getCompanyId();
    if (!containerName) return null;

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
      onProgress?.(percent);
    });

    if (res.info().status === 201) {
      return `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}`;
    } else {
      console.error('Upload failed', res.info());
      return null;
    }
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled picker');
    } else {
      console.error('Upload error:', err);
    }
    return null;
  }
};
