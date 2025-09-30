import DocumentPicker from '@react-native-document-picker/picker';

export const pickDocument = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.ppt,
        DocumentPicker.types.pptx,
        DocumentPicker.types.xls,
        DocumentPicker.types.xlsx,
        DocumentPicker.types.plainText,
        DocumentPicker.types.allFiles, // fallback
      ],
    });

    console.log('Picked file:', res);
    return res; // contains uri, name, size, type
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User canceled document picker');
    } else {
      console.error(err);
    }
  }
};
