// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';
// import RNFS from 'react-native-fs';

// interface Props {
//   fileUrl: string;
// }

// const DocumentViewer: React.FC<Props> = ({ fileUrl }) => {
//   const [webViewSource, setWebViewSource] = useState<string | null>(null);
//   const [isPDF, setIsPDF] = useState<boolean>(false);

//   useEffect(() => {
//     const loadFile = async () => {
//       const extension = fileUrl.split('.').pop()?.toLowerCase();
//       const fileName = fileUrl.split('/').pop();
//       const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//       if (extension === 'pdf') {
//         setIsPDF(true);
//         try {
//           const exists = await RNFS.exists(localPath);
//           if (!exists) {
//             await RNFS.downloadFile({ fromUrl: fileUrl, toFile: localPath }).promise;
//           }
//           const base64 = await RNFS.readFile(localPath, 'base64');
//           setWebViewSource(`data:application/pdf;base64,${base64}`);
//         } catch (err) {
//           console.error('PDF load error:', err);
//         } 
//       } else {
//         // For Excel, Word, etc.
//         setIsPDF(false);
//         const encodedUrl = encodeURIComponent(fileUrl);
//         setWebViewSource(`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`);
//       }
//     };

//     loadFile();
//   }, [fileUrl]);

//   return (
//     <View style={{ flex: 1, height: 500 }}>
//       {webViewSource ? (
//         <WebView
//           source={{ uri: webViewSource }}
//           style={{ flex: 1 }}
//           originWhitelist={['*']}
//           javaScriptEnabled
//           domStorageEnabled
//         />
//       ) : (
//         <ActivityIndicator size="large" />
//       )}
//     </View>
//   );
// };

// export default DocumentViewer;




// // <WebView
//             //   source={{
//             //     uri: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(chapterMaterialData?.url)}`
//             //   }}
//             //   style={[styles.webView, { height: scale(500) }]}
//             //   originWhitelist={['*']}
//             //   javaScriptEnabled={true}
//             //   domStorageEnabled={true}
//             //   startInLoadingState={true}
//             //   scalesPageToFit={true}
//             // />


import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Alert } from 'react-native';

export const openFileExternally = async (fileUrl:any) => {
  try {
    const fileName = fileUrl.split('/').pop();
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const res = await RNFS.downloadFile({
      fromUrl: fileUrl,
      toFile: localFilePath,
    }).promise;

    if (res.statusCode === 200) {
      await FileViewer.open(localFilePath);
    } else {
      Alert.alert('Download failed', 'Could not download the file');
    }
  } catch (err:any) {
    Alert.alert('Error', err.message);
  }
};
