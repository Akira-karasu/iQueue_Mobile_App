import { HomeStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "Home"
>;

export default function useHome() {
  const Homenavigation = useNavigation<HomeScreenNavigationProp>();

  const [requestCurrentTransactionList, setRequestCurrentTransactionList] = React.useState(null);

  return { Homenavigation, requestCurrentTransactionList, setRequestCurrentTransactionList };
}
