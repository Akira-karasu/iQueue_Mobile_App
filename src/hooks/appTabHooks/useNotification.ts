import { AppStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

type NotificationScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'NotificationStack'>;

export function useNotification() {
    const navigation = useNavigation<NotificationScreenNavigationProp>();
    const goTotabs = React.useCallback(() => {
        navigation.goBack();
      }, [navigation]);
    return {
        goTotabs,
    };
}