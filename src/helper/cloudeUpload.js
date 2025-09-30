  const UploadImage = () => {
    try {
      ImageCropPicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: false,
        sortOrder: 'none',
        compressImageQuality: Platform.OS === 'android' ? 1 : 0.8,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
        multiple: false,
      }).then(image => {
        uploadFunction(image);
      });
    } catch (err) {
      console.log('Image upload error:', err);
    }
  };
  const uploadVideoFunction = async (file: any) => {
    setVideoUploadLoader(true);
    // Step 1: Upload image to Azure Blob Storage using RNFetchBlob
    const pathSegments = file.path.split('/');
    const originalFilename = pathSegments[pathSegments.length - 1];
    const blobUri = `https://${AZAURE_STORAGE_CONNECTION_STRING}.blob.core.windows.net`;
    const sas = OAuthSettings.azureBlobStorageSASToken;
    const uploadUrl = `${blobUri}/${OAuthSettings.azureBlobStorageImageContainer}/${originalFilename}?${sas}`;
 
    // Step 2: Upload image to Azure Blob Storage using RNFetchBlob
    const response = await RNFetchBlob.fetch(
      'PUT',
      uploadUrl,
      {
        'x-ms-blob-type': 'BlockBlob',
        'content-type': file.mime,
        'x-ms-blob-content-type': file.mime,
      },
      RNFetchBlob.wrap(file.path),
    );
 
    // Step 3: Check the response
    if (response.respInfo.status === 201) {
      setVideoUploadLoader(false);
      setVid(response.respInfo.redirects[0]);
      dispatch(
        addImageVideoUrlRequest({
          consultationId: id,
          type: 'Video',
          url: response.respInfo.redirects[0],
        }),
      );
      console.log('Upload successful:', response);
    } else {
      setVideoUploadLoader(false);
      console.error('Upload failed:', response.respInfo.status, response.data);
    }
  };
  const UploadVideo = () => {
    try {
      ImageCropPicker.openPicker({
        mediaType: 'video',
        compressVideoPreset: 'MediumQuality',
      }).then(video => {
        uploadVideoFunction(video);
      });
    } catch (err) {
      console.log('Image upload error:', err);
    }
  };
  function removeImage(id: string) {
    InternetConnectionRequest()
      .then(() => {
        dispatch(imageVideoUrlDeleteRequest(id));
      })
      .catch(err => {
        showErrorAlert('please connect to internet', true);
      });
  }
 

  const uploadFunction = async (file: any) => {
    // Step 1: Upload image to Azure Blob Storage using RNFetchBlob
    const pathSegments = file.path.split('/');
    const originalFilename = pathSegments[pathSegments.length - 1];
    const blobUri = `https://${AZAURE_STORAGE_CONNECTION_STRING}.blob.core.windows.net`;
    const sas = OAuthSettings.azureBlobStorageSASToken;
    const uploadUrl = `${blobUri}/${OAuthSettings.azureBlobStorageImageContainer}/${originalFilename}?${sas}`;
 
    // Step 2: Upload image to Azure Blob Storage using RNFetchBlob
    const response = await RNFetchBlob.fetch(
      'PUT',
      uploadUrl,
      {
        'x-ms-blob-type': 'BlockBlob',
        'content-type': file.mime,
        'x-ms-blob-content-type': file.mime,
      },
      RNFetchBlob.wrap(file.path),
    );
 
    // Step 3: Check the response
    if (response.respInfo.status === 201) {
      setuserimage(response.respInfo.redirects[0]);
      dispatch(
        addImageVideoUrlRequest({
          consultationId: id,
          type: 'Image',
          url: response.respInfo.redirects[0],
        }),
      );
      console.log('Upload successful:', response);
    } else {
      console.error('Upload failed:', response.respInfo.status, response.data);
    }
  };