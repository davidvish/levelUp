// src/scorm-utils.ts
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
// @ts-ignore
import StaticServer from 'react-native-static-server';

let server: StaticServer | null = null;

export const downloadAndUnzipScorm = async (scormZipUrl: string): Promise<string> => {
  const zipPath = `${RNFS.DocumentDirectoryPath}/scorm.zip`;
  const unzipPath = `${RNFS.DocumentDirectoryPath}/scormcourse`;

  if (await RNFS.exists(unzipPath)) {
    await RNFS.unlink(unzipPath);
  }

  await RNFS.downloadFile({ fromUrl: scormZipUrl, toFile: zipPath }).promise;
  await unzip(zipPath, unzipPath);

  // Copy the wrapper files from Android assets to the unzipped SCORM folder
  await RNFS.copyFileAssets('scormwrapper.html', `${unzipPath}/scormwrapper.html`);
  await RNFS.copyFileAssets('scorm-again.min.js', `${unzipPath}/scorm-again.min.js`);

  return unzipPath;
};

export const startLocalServer = async (rootPath: string): Promise<string> => {
  if (server) {
    await server.stop();
  }

  server = new StaticServer(8080, rootPath, { localOnly: true });
  const localUrl = await server.start();
  return localUrl;
};

export const stopLocalServer = async () => {
  if (server) {
    await server.stop();
    server = null;
  }
};
