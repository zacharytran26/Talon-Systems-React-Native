import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "./ThemeContext";
import { Button, Layout, Text } from "@ui-kitten/components";

export default function LoginSSOScreen({ navigation }) {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [ssourl, setSsourl] = useState("https://etaqc.erau.edu/etasso");

  const onNavigationStateChange = (navigationState) => {
    const url = navigationState.url;

    if (
      url.includes(
        "https://etaqc.erau.edu/tseta/servlet/content?module=home&page=homepg&action=login_eta&xssohhy="
      )
    ) {
      setIsLoggedIn(true);
      setAuthUser({ sso: 1, username: "", sessionid: 0, accesscode: "" });
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
    Alert.alert("WebView Error", nativeEvent.description);
  };

  const fLogout = () => {
    setSsourl("https://fed.erau.edu/ERAULoginV2/logout.jsp");
    setIsLoggedIn(false);
    setAuthUser(null);
    console.log("fLogout...");
  };

  const fLogin = () => {
    setSsourl("https://etaqc.erau.edu/etasso");
    setIsLoggedIn(true);
    setAuthUser({ sso: 1, username: "", sessionid: 0, accesscode: "" });
    console.log("fLogin...");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Text category="h1">Login SSO</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={fLogout}>
            LOGOUT
          </Button>
          <Button style={styles.button} onPress={fLogin}>
            LOGIN
          </Button>
        </View>
        <WebView
          source={{ uri: ssourl }}
          onLoadStart={(navState) => setSsourl(navState.nativeEvent.url)}
          onNavigationStateChange={onNavigationStateChange}
          onError={handleWebViewError}
          startInLoadingState={true}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
