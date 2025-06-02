import AreaMap from "@/components/AreaMap";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Map = () => {
  const { user, refetch, isLoggedIn } = useGlobalContext();

  if (!isLoggedIn) return <Redirect href="/" />;

  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Success", "You have been logged out");
      refetch();
    } else {
      Alert.alert("Error", "An error occured while logging out");
    }
  };

  return (
    <>
      <SafeAreaView className="items-center justify-center">
        <Text className="text-2xl font-rubik-bold mt-2">
          Hello! {user?.name}👋
        </Text>
        <TouchableOpacity>
          <Text className="text-xl text-red-600" onPress={handleLogout}>
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <AreaMap />
    </>
  );
};

export default Map;
