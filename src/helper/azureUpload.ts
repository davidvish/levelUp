import RNFS from 'react-native-fs';
import { OAuthSettingsLms } from '../assets/json/CloudOAuthSettings';

export const uploadToAzure = async (localFile: any, containerName: string) => {

    console.log("ContainerName",containerName);
    
  try {
    if (!localFile?.localUri) throw new Error('localUri missing');

    // 1️⃣ Get the file path
    let fileUri = localFile.localUri.replace('file://', '');

    // 2️⃣ Read the file as base64
    const fileData = await RNFS.readFile(fileUri, 'base64');

    // 3️⃣ Convert base64 -> binary (Uint8Array)
    const binary = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

    // 4️⃣ Prepare file name
    const fileName = encodeURIComponent(localFile.fileName || fileUri.split('/').pop());
    const containerNameToLowerCase = containerName?.toLowerCase();

    const timestamp = Date.now();
        const safeFileName = encodeURIComponent(`${timestamp}-${fileName}`); // e.g. 1759494787059-abcd.docx
    // 5️⃣ Build Azure blob URL
        const blobUrl = `https://${OAuthSettingsLms.azureBlobStorageName}.blob.core.windows.net/${containerNameToLowerCase}/${safeFileName}?${OAuthSettingsLms.azureBlobStorageSASToken}`;

        // Video(xls, .xlsx,.docx, .doc, .pptx, .pdf, .mp4) 
    // 6️⃣ Upload via fetch
    const response = await fetch(blobUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'application/octet-stream',
      },
      body: binary, // ⚡ Here you pass the binary, not base64
    });
    console.log(response);
    

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

    // 7️⃣ Return the public URL (without SAS token)
    return `https://${OAuthSettingsLms.azureBlobStorageName}.blob.core.windows.net/${containerName}/${fileName}`;
  } catch (err) {
    console.error('Azure upload error:', err);
    return null;
  }
};
