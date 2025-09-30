import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
  loginRequestAction,
  loginSuccessAction,
  logoutRequestAction,
  logoutSuccessAction,
  //refreshTokenRequestAction,
  //refreshTokenSuccessAction,
  socialGoogleLoginRequestAction,
  socialGoogleLoginSuccessAction,
  socialGoogleLoginFailAction,
  socialAppleRequestAction,
  socialAppleSuccessAction,
  socialAppleFailAction,
  socialFacebookLoginRequestAction,
  socialFacebookLoginSuccessAction,
  socialFacebookLoginFailAction,
  socialMicrosoftLoginRequestAction,
  socialMicrosoftLoginSuccessAction,
  socialMicrosoftLoginFailAction,
  userExistRequestAction,
  userExistLoginSuccessAction,
  userExistLoginFailAction,
  remberMeAction,
  LoggedTimeEntryRequestAction,
  LoggedTimeEntrySuccessAction,
  refreshTokenRequestAction,
  refreshTokenSuccessAction,
  refreshTokenFailAction
} from './action';

const initialState : any = {
  userData: {},
  islogin: false,
  isLoading: false,
  loginDetails: {},
  firstTimeLogin: true,
  refreshTokenData: [],
  refreshTokenLoading:false,
  soicalGoogleLoginLoading:false,
  soicalGoogleLoginData:[],
  soicalAppleLoading:false,
  soicalAppleData:[],
  soicalFacebookLoading:false,
  soicalFacebookLoginData:[],
  soicalMicrosoftLoading:false,
  soicalMicrosoftLoginData:[],
  userExistData: [],
  userExistLoading: false,
  LoggedTimeEntryLoading:false,
};
const loginReducer = createReducer(initialState, builder => {
  builder.addCase(loginRequestAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
    };
  });
  builder.addCase(loginSuccessAction, (state, action) => {
    return {
      ...state,
      userData: action.payload,
      islogin: true,
      isLoading: false,
      firstTimeLogin: false,
    };
  });
  builder.addCase(logoutRequestAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
    };
  });
  builder.addCase(logoutSuccessAction, (state, action) => {
    return {
      ...state,
      userData: {},
      islogin: false,
      isLoading: false,
    };
  });

  builder.addCase(refreshTokenRequestAction, (state, action) => {
    return {
      ...state,
      refreshTokenLoading: true,
    };
  });
  builder.addCase(refreshTokenSuccessAction, (state, action) => {
    return {
      ...state,
      refreshTokenData: action.payload,
      refreshTokenLoading: false,
    };
  });

  builder.addCase(refreshTokenFailAction, (state, action) => {
    return {
      ...state,
      refreshTokenData: [],
      refreshTokenLoading: false,
    };
  });

  builder.addCase(socialGoogleLoginRequestAction, (state, action) => {
    return {
      ...state,
      soicalGoogleLoginLoading: true,
    };
  });
  builder.addCase(socialGoogleLoginSuccessAction, (state, action) => {
    return {
      ...state,
      soicalGoogleLoginData: action.payload,
      soicalGoogleLoginLoading: false,
    };
  });

  builder.addCase(socialGoogleLoginFailAction, (state, action) => {
    return {
      ...state,
      soicalGoogleLoginData: [],
      soicalGoogleLoginLoading: false,
    };
  });


  builder.addCase(socialAppleRequestAction, (state, action) => {
    return {
      ...state,
      soicalAppleLoading: true,
    };
  });
  builder.addCase(socialAppleSuccessAction, (state, action) => {
    return {
      ...state,
      soicalAppleData: action.payload,
      soicalAppleLoading: false,
    };
  });

  builder.addCase(socialAppleFailAction, (state, action) => {
    return {
      ...state,
      soicalAppleData: [],
      soicalAppleLoading: false,
    };
  });

  builder.addCase(socialFacebookLoginRequestAction, (state, action) => {
    return {
      ...state,
      soicalFacebookLoading: true,
    };
  });
  builder.addCase(socialFacebookLoginSuccessAction, (state, action) => {
    return {
      ...state,
      soicalFacebookLoginData: action.payload,
      soicalFacebookLoading: false,
    };
  });

  builder.addCase(socialFacebookLoginFailAction, (state, action) => {
    return {
      ...state,
      soicalFacebookLoginData: [],
      soicalFacebookLoading: false,
    };
  });


  builder.addCase(socialMicrosoftLoginRequestAction, (state, action) => {
    return {
      ...state,
      soicalMicrosoftLoading: true,
    };
  });
  builder.addCase(socialMicrosoftLoginSuccessAction, (state, action) => {
    return {
      ...state,
      soicalMicrosoftLoginData: action.payload,
      soicalMicrosoftLoading: false,
    };
  });

  builder.addCase(socialMicrosoftLoginFailAction, (state, action) => {
    return {
      ...state,
      soicalMicrosoftLoginData: [],
      soicalMicrosoftLoading: false,
    };
  });

  builder.addCase(userExistRequestAction, (state, action) => {
    return {
      ...state,
      userExistLoading: true,
    };
  });
  builder.addCase(userExistLoginSuccessAction, (state, action) => {
    return {
      ...state,
      userExistData: action.payload,
      userExistLoading: false,
    };
  });

  builder.addCase(userExistLoginFailAction, (state, action) => {
    return {
      ...state,
      userExistData: [],
      userExistLoading: false,
    };
  });

  builder.addCase(remberMeAction, (state, action : any) => {
    return {
      ...state,
      loginDetails: action?.payload?.body,
      userExistLoading: false,
    };
  });

  builder.addCase(LoggedTimeEntryRequestAction, (state, action) => {
    return {
      ...state,
      LoggedTimeEntryLoading: true,
    };
  });
  builder.addCase(LoggedTimeEntrySuccessAction, (state, action) => {
    return {
      ...state,
      soicalFacebookLoginData: action.payload,
      LoggedTimeEntryLoading: false,
    };
  });

});
export default loginReducer;

export const loginSelector = () => {
  const {soicalAppleData, soicalAppleLoading, refreshTokenData, refreshTokenLoading, LoggedTimeEntryLoading, userExistData, userExistLoading, userData, islogin, isLoading, firstTimeLogin, soicalGoogleLoginLoading, soicalGoogleLoginData, soicalFacebookLoading, soicalFacebookLoginData, soicalMicrosoftLoading, soicalMicrosoftLoginData, loginDetails} =
    useSelector((state : any) => state.loginReducer);
  return {soicalAppleData, soicalAppleLoading, LoggedTimeEntryLoading, userExistData, userExistLoading, userData, islogin, isLoading, firstTimeLogin, soicalGoogleLoginLoading, soicalGoogleLoginData, soicalFacebookLoading, soicalFacebookLoginData, soicalMicrosoftLoading, soicalMicrosoftLoginData, loginDetails };
};