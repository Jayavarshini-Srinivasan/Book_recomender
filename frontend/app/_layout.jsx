import {  Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useAuthStore } from "../store/authStore";
import { useEffect ,useState} from "react";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token , isCheckingAuth} = useAuthStore();
  const [authchecked , setAuthChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(()=>{
    const initAuth = async()=>{
      await checkAuth();
      setAuthChecked(true);
    };
    initAuth();
  },[]);

  //hide splash once fonts are loaded
  useEffect(() => {
    if (fontsLoaded && authchecked){
      SplashScreen.hideAsync();
    } 
  }, [fontsLoaded , authchecked]);

  
  // handle navigation based on the auth state
  useEffect(() => {

    if (isCheckingAuth) return;
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  }, [user, token, segments, isCheckingAuth]);

  // wait until the fonts are ready
  if(!fontsLoaded || !authchecked){
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
