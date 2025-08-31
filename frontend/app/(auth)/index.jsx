import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import {Link} from "expo-router";
import styles from "../../assets/styles/login.styles.js";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {};

  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior = {"height"}>
    <View style={styles.container}>
      {/* illustration*/}
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/i.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/*Form*/}

      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          {/*email */}

          {/*password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              {/*left icon */}
              <Ionicons
                name="lock-closed"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />

              {/*input */}
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholderTextColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/*password */}


          {/*login button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}> Login</Text>
            )}
          </TouchableOpacity>
          {/*login button */}

          {/*footer */}
          <View style = {styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.link}> Sign Up</Text>
              </TouchableOpacity></Link>
          </View>
        </View>
        {/*form */}
      </View>
      {/*container */}
    </View>
    </KeyboardAvoidingView>
  );
}
