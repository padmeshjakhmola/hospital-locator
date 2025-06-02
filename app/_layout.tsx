import GlobalProviders from "@/lib/global-provider";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <GlobalProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </GlobalProviders>
  );
}
