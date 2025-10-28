import { ProfileStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;


export function useProfile(){

const profileStackNavigation = useNavigation<ProfileScreenNavigationProp>();


const onGoToAccountSettings = React.useCallback(() => {
    profileStackNavigation.navigate("AccountSettings");
  }, [profileStackNavigation]);

const onGoToAppSettings = React.useCallback(() => {
    profileStackNavigation.navigate("AppSettings");
  }, [profileStackNavigation]);


const onGoToProfile = React.useCallback(() => {
    profileStackNavigation.navigate("Profile");
  }, [profileStackNavigation]);



  const [accountInfo, setAccountInfo] = React.useState({
    accountID: "139476578543",
    email: "user010@gmail.com",
  });

  const [passwords, setPasswords] = React.useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [deviceFunction, setDeviceFunction] = React.useState({
    notification: false,
    media: false,
    mobileData: false,
  });

    return {
        accountInfo,
        passwords,
        deviceFunction,
        setAccountInfo,
        setPasswords,
        setDeviceFunction,
        onGoToAccountSettings,
        onGoToAppSettings,
        onGoToProfile
    }
}