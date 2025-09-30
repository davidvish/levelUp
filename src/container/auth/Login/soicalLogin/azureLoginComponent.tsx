// import { Platform } from 'react-native';
// import PublicClientApplication from 'react-native-msal';
// import type { 
//   MSALConfiguration, 
//   MSALInteractiveParams, 
//   MSALResult, 
//   MSALSilentParams, 
//   MSALAccount, 
//   MSALSignoutParams 
// } from 'react-native-msal';
// import { string } from 'yup';

// const config: MSALConfiguration = {
//   auth: {
//     clientId: '01921824-2be2-4770-a31e-99df487db896',
//     authority: 'https://login.microsoftonline.com/organizations', // or specific tenant
//     redirectUri: Platform.OS === "android" ? 'msauth://com.levelUp/%2BJ%2B3yf%2FmrgPgKeg1llIttpSjcws%3D' : "msauth.com.levelupLMS://auth",
//     },
// };

// const scopes = ['User.ReadWrite.All'];
// const pca = new PublicClientApplication(config);

// async function initializePCA() {
//   try {
//     await pca.init();
//     console.log('PCA initialized successfully');
//   } catch (error) {
//     console.error('Error initializing PCA:', error);
//     if (error instanceof Error) {
//       console.error('Error message:', error.message);
//       console.error('Error stack:', error.stack);
//     }
//   }
// }

// async function acquireToken() {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }
  
//   const params: MSALInteractiveParams = { scopes };
//   try {
//     const result: any = await pca.acquireToken(params);
//     console.log('Token acquired:', result);
//     return result;
//   } catch (error) {
//     console.error('Error acquiring token:', error);
//   }
// }

// async function acquireTokenSilent(account: MSALAccount) {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }

//   const params: MSALSilentParams = {
//     account,
//     scopes,
//     forceRefresh: true,
//   };
//   try {
//     const result: any = await pca.acquireTokenSilent(params);
//     console.log('Silent token acquired:', result);
//     return result;
//   } catch (error) {
//     console.error('Error acquiring silent token:', error);
//   }
// }

// async function getAccounts() {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }
  
//   try {
//     const accounts: MSALAccount[] = await pca.getAccounts();
//     console.log('Accounts:', accounts);
//     return accounts;
//   } catch (error) {
//     console.error('Error retrieving accounts:', error);
//   }
// }

// async function getAccount(accountIdentifier: string) {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }
  
//   try {
//     const account: MSALAccount | undefined = await pca.getAccount(accountIdentifier);
//     console.log('Account:', account);
//     return account;
//   } catch (error) {
//     console.error('Error retrieving account:', error);
//   }
// }

// async function removeAccount(account: MSALAccount) {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }

//   try {
//     const success: boolean = await pca.removeAccount(account);
//     console.log('Account removed:', success);
//     return success;
//   } catch (error) {
//     console.error('Error removing account:', error);
//   }
// }

// async function signOut(account: MSALAccount) {
//   if (!pca) {
//     throw new Error('PCA is not initialized');
//   }

//   const params: MSALSignoutParams = {
//     account,
//     signoutFromBrowser: true,
//   };
//   try {
//     const success: boolean = await pca.signOut(params);
//     console.log('Sign out successful:', success);
//     return success;
//   } catch (error) {
//     console.error('Error signing out:', error);
//   }
// }

// export {
//   initializePCA,
//   acquireToken,
//   acquireTokenSilent,
//   getAccounts,
//   getAccount,
//   removeAccount,
//   signOut
// };

// azureAuth.ts
import { Platform } from 'react-native';
import PublicClientApplication from 'react-native-msal';
import type {
  MSALConfiguration,
  MSALInteractiveParams,
  MSALSilentParams,
  MSALResult,
  MSALAccount,
  MSALSignoutParams,
} from 'react-native-msal';

// Singleton PCA instance and init state
let pca: PublicClientApplication;
let initialized = false;

// Configuration
const config: MSALConfiguration = {
  auth: {
    clientId: '01921824-2be2-4770-a31e-99df487db896',
    authority: 'https://login.microsoftonline.com/organizations',
    redirectUri: Platform.OS === 'android'
      ? 'msauth://com.levelUp/%2BJ%2B3yf%2FmrgPgKeg1llIttpSjcws%3D'
      : 'msauth.com.levelupLMS://auth',
  },
};

const scopes = ['User.ReadWrite.All'];

async function initializePCA(): Promise<void> {
  if (!initialized) {
    pca = new PublicClientApplication(config);
    try {
      await pca.init(); // crucial: wait for init
      initialized = true;
      console.log('✅ MSAL initialized');
    } catch (error) {
      console.error('❌ MSAL initialization error:', error);
      throw error;
    }
  }
}

async function acquireToken(): Promise<any> {
  await initializePCA();
  const params: MSALInteractiveParams = { scopes };
  return await pca.acquireToken(params);
}

async function acquireTokenSilent(account: MSALAccount): Promise<any> {
  await initializePCA();
  const params: MSALSilentParams = {
    account,
    scopes,
    forceRefresh: true,
  };
  return await pca.acquireTokenSilent(params);
}

async function getAccounts(): Promise<MSALAccount[]> {
  await initializePCA();
  return await pca.getAccounts();
}

async function getAccount(accountId: string): Promise<MSALAccount | undefined> {
  await initializePCA();
  return await pca.getAccount(accountId);
}

async function removeAccount(account: MSALAccount): Promise<boolean> {
  await initializePCA();
  return await pca.removeAccount(account);
}

async function signOut(account: MSALAccount): Promise<boolean> {
  await initializePCA();
  const params: MSALSignoutParams = {
    account,
    signoutFromBrowser: true,
  };
  return await pca.signOut(params);
}

export {
  acquireToken,
  acquireTokenSilent,
  getAccounts,
  getAccount,
  removeAccount,
  signOut,
  initializePCA,
};

