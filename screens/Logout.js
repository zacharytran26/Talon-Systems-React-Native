import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Layout } from "@ui-kitten/components";
import { useAuth } from "../screens/ThemeContext";

export default function LogoutScreen({ navigation }) {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const logOut = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
  };

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.title}>
        Are you sure you want to log out?
      </Text>
      <Button style={styles.button} onPress={logOut}>
        Logout
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    backgroundColor: "#f20a0a",
    borderColor: "#f20a0a",
    borderRadius: 25,
  },
});
