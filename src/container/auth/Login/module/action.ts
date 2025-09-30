import { createAction } from '@reduxjs/toolkit';

// ===> request
export const remberMeAction : any = createAction('request/remberMeAction');
export const loginRequestAction: any = createAction('request/loginRequestAction');
export const logoutRequestAction: any = createAction('request/logoutRequestAction');

// ===> Actions
//export const rememberMeAction = createAction('rememberMeAction');
export const loginSuccessAction: any = createAction('loginSuccessAction');
export const logoutSuccessAction: any = createAction('logoutSuccessAction');

export const refreshTokenRequestAction: any = createAction('request/refreshTokenRequestAction');
export const refreshTokenSuccessAction: any = createAction('refreshTokenSuccessAction');
export const refreshTokenFailAction: any = createAction(
    'refreshTokenFailAction',
);

export const socialGoogleLoginRequestAction: any = createAction('socialGoogleLoginRequestAction');
export const socialGoogleLoginSuccessAction: any = createAction('socialGoogleLoginSuccessAction');
export const socialGoogleLoginFailAction: any = createAction('socialGoogleLoginFailAction');

export const socialFacebookLoginRequestAction: any = createAction('socialFacebookLoginRequestAction');
export const socialFacebookLoginSuccessAction: any = createAction(
    'socialFacebookLoginSuccessAction',
);
export const socialFacebookLoginFailAction: any = createAction(
    'socialFacebookLoginFailAction',
);

export const socialAppleRequestAction: any = createAction('socialAppleRequestAction');
export const socialAppleSuccessAction: any = createAction('socialAppleSuccessAction');
export const socialAppleFailAction: any = createAction('socialAppleFailAction');

export const socialMicrosoftLoginRequestAction: any = createAction('socialMicrosoftLoginRequestAction');
export const socialMicrosoftLoginSuccessAction: any = createAction(
    'socialMicrosoftLoginSuccessAction',
);
export const socialMicrosoftLoginFailAction: any = createAction(
    'socialMicrosoftLoginFailAction',
);

export const userExistRequestAction: any = createAction('userExistRequestAction');
export const userExistLoginSuccessAction: any = createAction(
    'userExistLoginSuccessAction',
);
export const userExistLoginFailAction: any = createAction(
    'userExistLoginFailAction',
);


export const LoggedTimeEntryRequestAction: any = createAction('LoggedTimeEntryRequestAction');
export const LoggedTimeEntrySuccessAction: any = createAction(
    'LoggedTimeEntrySuccessAction',
);
