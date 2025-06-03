import GlobalProviders from "@/lib/global-provider";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GlobalProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProviders>
  );
}
