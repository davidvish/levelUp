import { pick, keepLocalCopy } from '@react-native-documents/picker';

export const pickDocument = async () => {
  try {
    const [file] = await pick();    

    const [localCopy] = await keepLocalCopy({
      files: [
        { uri: file.uri, fileName: file.name ?? 'fallbackName' },
      ],
      destination: 'documentDirectory',
    });

    return localCopy; // <--- This is the object with localUri
  } catch (err) {
    console.warn('Error picking document', err);
    return null;
  }
};
