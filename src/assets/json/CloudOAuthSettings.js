// export const OAuthSettings = {
//   azureBlobStorageSASToken:"sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2091-05-04T13:56:56Z&st=2021-05-04T05:56:56Z&spr=https&sig=P4Rmd0mjprH4pBt8sWaZ97GdHbO3MpHgZAmkLixO0CQ%3D",
//   azureBlobStorageName:"leveluplmsdevstorage", //hai
//   azureBlobStorageImageContainer: 'virtcochatimage',
//   azureBlobStorageFileContainer:"virtcochatfiles",
//   azureBlobImageStorageContainerName: "lmsimages",
//   imageHost: "https://leveluplmsdevstorage.blob.core.windows.net/", // + hai name
//   //azureBlobStorageSASToken: "sp=racwdl&st=2022-02-10T07:18:17Z&se=2022-02-10T15:18:17Z&spr=https&sv=2020-08-04&sr=c&sig=%2BEdRvtqfadVDQJHvMRdzac4BNDdX2TfNm890UWnRH6k%3D",
//   //https://leveluplmsdevstorage.blob.core.windows.net/virtcochatimage?sp=racwdl&st=2022-02-10T07:1…
//   scopes: ["user.read", "calendars.readWrite", "files.read"], //hai
// };
export const OAuthSettingsLms = {
  azureBlobStorageSASToken:"sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2091-05-04T13:56:56Z&st=2021-05-04T05:56:56Z&spr=https&sig=P4Rmd0mjprH4pBt8sWaZ97GdHbO3MpHgZAmkLixO0CQ%3D",
  azureBlobStorageName:"leveluplmsdevstorage",
  azureBlobStorageImageContainer: localStorage.getItem('companyId'), //you can get it from storage after login
  azureBlobStorageFileContainer: localStorage.getItem('companyId'),
  azureBlobImageStorageContainerName: localStorage.getItem('companyId'),
  imageHost: "https://leveluplmsdevstorage.blob.core.windows.net/",
  scopes: ["user.read", "calendars.readWrite", "files.read"],
};

// export const dev ={
//     appRemote: "https://leveluplmsdev-ui.azurewebsites.net/remote/remoteEntry.js?v=62",
//     appURLLogin: "https://appdev.leveluplms.com",
//     apiURL: "https://appdev.leveluplms.com",
//     facebook_Id: "5380121288736894",
//     googleProvider: "646759103590-1lpfj7mrt6301i73p3uqvd267eacrkbd.apps.googleusercontent.com",
//     STS_URL: "https://lmssts.azurewebsites.net",
//     payfirmaUrl: "https://apigateway.payfirma.com",
//     tenantId: "c061f160-51f9-4693-8f3b-4f153237e8f4",
//     secretKey: "CEi8Q~UyamtdWPeTmd8y-v2RQs5OBv47A3FMqbDW",
//     appId: "bcd13e2d-0e08-4355-a2f7-69747885c718",
//     masterEmail: "dev3@evolvous.com",
//     sharepointURL: "https://evolvous.sharepoint.com",
//     ChannelId: "5a147fce-5a53-482a-bb02-85c4087fd3fa",
//     azureBlobStorageName: "leveluplmsdevstorage",
//     azureBlobStorageContainerName: localStorage.getItem('companyId'),
//     imageHost: "https://leveluplmsdevstorage.blob.core.windows.net/",
//     azureBlobStorageSignature: "?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2091-05-04T13:56:56Z&st=2021-05-04T05:56:56Z&spr=https&sig=P4Rmd0mjprH4pBt8sWaZ97GdHbO3MpHgZAmkLixO0CQ%3D",
//     scopes: ["user.read", "calendars.readWrite", "files.read"],
//     supportEmail: "dev3@evolvous.com",
//     NON_SAAS: false,
//     AMS: true
//   }