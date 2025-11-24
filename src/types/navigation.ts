import { NavigatorScreenParams } from "@react-navigation/native";

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
  RequestStack: NavigatorScreenParams<RequestStackParamList>;
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

export type RequestStackParamList = {
  Request: undefined;
  Transaction: { transaction: any };
  Queue: { queueData: any, queueStatus: any };
};
