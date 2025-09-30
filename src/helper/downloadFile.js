import { Alert } from "react-native";
import RNFS from "react-native-fs";

export const handleDownload = async (file) => {
    console.log(RNFS);
    
  try {
    const fileUrl = file;
        console.log('handleDownload file', fileUrl);

    if (!fileUrl) {
      Alert.alert("Error", "No file available to download");
      return;
    }

    // Extract file name from URL
    const fileName = decodeURIComponent(fileUrl.split("/").pop().split("?")[0]);

    // Save in Document Directory
    const localFile = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    // Start download
    const options = {
      fromUrl: fileUrl,
      toFile: localFile,
      background: true,
      discretionary: true,
    };

    const result = await RNFS.downloadFile(options).promise;

    if (result.statusCode === 200) {
    //  Alert.alert("Download Complete", `File saved at:\n${localFile}`);
      console.log("✅ File downloaded to:", localFile);
    } else {
      Alert.alert("Download Failed", "Something went wrong while downloading.");
    }
  } catch (err) {
    console.error("Download error:", err);
    Alert.alert("Error", "Failed to download file.");
  }
};