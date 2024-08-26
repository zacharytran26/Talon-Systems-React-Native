import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "./ThemeContext";
import { Button, Layout, Text } from "@ui-kitten/components";

export default function LoginSSOScreen({ navigation }) {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [ssourl, setSsourl] = useState(
    "https://apps5.talonsystems.com/tseta/servlet/content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=&customer=eta0000&mode=ssotest&etamobilepro=1&nocache=n"
  );

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
    Alert.alert("WebView Error", nativeEvent.description);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Text category="h1">SSO Login</Text>
        </View>
        <WebView
          source={{ uri: ssourl }}
          onError={handleWebViewError}
          onMessage={(event) => {
            setIsLoggedIn(true);
            setAuthUser(JSON.parse(event.nativeEvent.data));
          }}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
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
