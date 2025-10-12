export type RootStackParamList = {
    App: undefined;
    Auth: undefined;
}

export type AuthStackParamList = {
    Login: undefined;
    Forgot: {
        email: string;
    };
    Register: undefined;
    Change: {
        email: string;
    };
    Otp: {
        email: string;
    };
}

export type AppStackParamList = {
  Tabs: undefined;
  NotificationStack: undefined;
};

export type AppTabsParamList = {
  HomeStack: undefined;
  Request: undefined;
  ProfileStack: undefined;
  
};

export type ProfileStackParamList = {
  Profile: undefined;
  AccountSettings: undefined;
  AppSettings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};
