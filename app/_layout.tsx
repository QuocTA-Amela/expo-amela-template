import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import useEasUpdate from "@/hooks/useEasUpdate";
import { QueryClient, QueryClientProvider } from "react-query";
import authenticateStore from "@/store/authenticateStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 24 * 3600 * 1000, // cache for 1 day
      retry: false,
      notifyOnChangeProps: "tracked",
      keepPreviousData: true,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { onFetchUpdateAsync } = useEasUpdate();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const rehydrated = authenticateStore.persist.hasHydrated();

  useEffect(() => {
    if (loaded && rehydrated) {
      SplashScreen.hideAsync();
      onFetchUpdateAsync();
    }
  }, [loaded, rehydrated]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
