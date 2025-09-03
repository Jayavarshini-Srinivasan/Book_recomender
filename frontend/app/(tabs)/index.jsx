import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/authStore";
import SafeScreen from "../../components/SafeScreen";

export default function Home() {
  const { logout } = useAuthStore();
  return (
    <SafeScreen>
      <View>
        <Text>Home tab</Text>
        <TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
