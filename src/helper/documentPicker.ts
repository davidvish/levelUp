import { pick, keepLocalCopy } from '@react-native-documents/picker';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';

export const pickDocument = async () => {
  try {
    const [file] = await pick(); // open file picker
    if (!file) return null;

    const fileName = file.name || file.uri.split('/').pop();
    const fileExt = fileName?.split('.').pop()?.toLowerCase();

    // ✅ Allowed file extensions
    const allowedExtensions = ['xls', 'xlsx', 'doc', 'docx', 'pptx', 'pdf', 'mp4'];

    // ❌ Check allowed file type
    if (!allowedExtensions.includes(fileExt)) {
      Alert.alert(
        'Invalid File',
        `Only ${allowedExtensions.join(', ')} files are allowed.`
      );
      return null;
    }

    // ✅ Copy file to local storage
    const [localCopy] = await keepLocalCopy({
      files: [{ uri: file.uri, fileName: fileName || 'fallbackName' }],
      destination: 'documentDirectory',
    });

    // ✅ Get file size
    const stat = await RNFS.stat(localCopy?.localUri);
    const fileSizeMB = stat.size / (1024 * 1024); // Convert bytes → MB

    // ✅ Define size limits based on type
    const isVideo = fileExt === 'mp4';
    const MAX_FILE_SIZE_MB = isVideo ? 200 : 20;

    // ❌ Validate size
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      Alert.alert(
        'File too large',
        `The selected ${isVideo ? 'video' : 'document'} exceeds the ${MAX_FILE_SIZE_MB} MB limit.`
      );
      return null;
    }

    console.log('📄 File selected:', {
      name: fileName,
      type: fileExt,
      size: `${fileSizeMB.toFixed(2)} MB`,
      uri: localCopy?.localUri,
    });

    // ✅ Return enriched file info
    return {
      ...localCopy,
      fileName,
      fileExt,
      fileSizeMB,
      isVideo,
    };
  } catch (err) {
    console.warn('Error picking document:', err);
    return null;
  }
};
