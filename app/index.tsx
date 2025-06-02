import icons from "@/constants/icons";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/map" />;

  const handleLogin = async () => {
    const result = await login();
    refetch();
    if (result) {
      console.log("Login Success");
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <View className="flex flex-col items-center justify-center h-screen px-10 gap-10">
      <Text className="text-2xl font-semibold">
        Login to check hospitals near you
      </Text>
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
      >
        <View className="flex flex-row items-center justify-center">
          <Image
            source={icons.google}
            className="w-8 h-8"
            resizeMode="contain"
          />
          <Text className="text-2xl font-rubik-medium text-black-300 ml-2">
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
