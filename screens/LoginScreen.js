import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Input, Button, Layout, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "./ThemeContext";

const LoginScreen = ({ navigation }) => {
  const [accesscode, setAccesscode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLabel, setLoginLabel] = useState("LOGIN");

  const { setUrl, authUser, setAuthUser, isLoggedIn, setIsLoggedIn } =
    useAuth();

  useEffect(() => {
    loadAccessCode();
  }, []);

  const loadAccessCode = async () => {
    try {
      const savedAccessCode = await AsyncStorage.getItem("accesscode");
      if (savedAccessCode !== null) {
        setAccesscode(savedAccessCode);
        fCheckAccessCode(savedAccessCode);
      }
    } catch (error) {
      console.error("Failed to load access code", error);
    }
  };

  const saveAccessCode = async (acode) => {
    try {
      await AsyncStorage.setItem("accesscode", acode);
    } catch (error) {
      console.error("Failed to save access code", error);
    }
  };

  const saveUsername = async (user) => {
    try {
      await AsyncStorage.setItem("username", user);
    } catch (error) {
      console.error("Failed to save username", error);
    }
  };

  function fCheckAccessCode(acode) {
    var ucode = acode.toUpperCase();
    if (ucode === "ERQ2013") {
      setLoginLabel("CONTINUE");
    } else {
      setLoginLabel("LOGIN");
    }
    setAccesscode(ucode);
  }

  function fLogin() {
    if (accesscode === "ERQ2013" && loginLabel === "CONTINUE") {
      navigation.navigate("LoginSSO");
    }

    if (accesscode === "") {
      Alert.alert("You must specify an Access Code.");
      return;
    }
    if (username === "") {
      Alert.alert("You must specify a User Name.");
      return;
    }
    if (password === "") {
      Alert.alert("You must specify a Password.");
      return;
    }

    const conn = ""; //checkConnection();

    if (conn === "No network connection" || conn === "Unknown connection") {
      Alert.alert("You do not have an internet connection!");
    } else {
      const svr = accesscode.substring(0, 2).replace("0", ""); //remove leading zeros from the server: 02 becomes 2
      const talProd = "https://apps" + svr + ".talonsystems.com/";
      const localAcode = accesscode;

      var schema = "";
      // ERAU DEV
      if (localAcode.substring(0, 3).toUpperCase() === "ERD") {
        schema = "";
      } else if (localAcode.substring(0, 3).toUpperCase() === "ERQ") {
        schema = "";
      } else if (localAcode.substring(0, 3).toUpperCase() === "ERP") {
        schema = "";
      } else if (localAcode.substring(0, 6).toUpperCase() === "TALDEV") {
        schema = "";
      } else if (localAcode.substring(0, 6).toUpperCase() === "TALTST") {
        schema = "";
      } else {
        schema = localAcode.substring(2, 6);
      }

      if (
        accesscode.substring(0, 1).toUpperCase() !== "E" &&
        isNaN(accesscode)
      ) {
        Alert.alert(
          "You have entered an invalid access code. Only numeric characters are allowed."
        );
      } else if (
        accesscode.substring(0, 1).toUpperCase() !== "E" &&
        accesscode.substring(0, 2) !== "01" &&
        accesscode.substring(0, 2) !== "02" &&
        accesscode.substring(0, 2) !== "03" &&
        accesscode.substring(0, 2) !== "04" &&
        accesscode.substring(0, 2) !== "05" &&
        accesscode.substring(0, 2) !== "06" &&
        accesscode.substring(0, 2) !== "07" &&
        accesscode.substring(0, 2) !== "08" &&
        accesscode.substring(0, 2) !== "09" &&
        accesscode.substring(0, 2) !== "10" &&
        accesscode.substring(0, 2) !== "11" &&
        accesscode.substring(0, 2) !== "12"
      ) {
        Alert.alert("You have entered an invalid access code.");
      } else if (
        accesscode.substring(0, 1).toUpperCase() !== "E" &&
        accesscode.length !== 10
      ) {
        Alert.alert("You have entered an invalid access code.");
      } else {
        var url = talProd + "tseta/servlet/";
        var sHost = talProd + "tseta/servlet/";

        var sHostResURL =
          sHost +
          "content?module=home&page=m&reactnative=1&accesscode=" +
          accesscode +
          "&customer=eta" +
          schema +
          "&etamobilepro=1&nocache=n";
        var getURL =
          sHostResURL +
          "&mode=mLogin" +
          "&uname=" +
          username +
          "&password=" +
          password;

        fetch(getURL)
          .then((response) => response.json())
          .then((json) => {
            if (json.validated == "1") {
              json.host = sHost;
              setAuthUser(json);
              console.log(json);
              setIsLoggedIn(true);
              saveAccessCode(accesscode); // Save the access code on successful logins
              saveUsername(username);
            } else {
              Alert.alert("You are not authorized to access ETA.");
              setIsLoggedIn(false);
              setAuthUser(null);
            }
            return json;
          })
          .catch((error) => {
            Alert.alert(error.message);
            console.error(error.message);
          });
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <Layout style={styles.container}>
        <Image style={styles.image} source={require("../assets/login.png")} />
        <Input
          style={styles.input}
          value={accesscode}
          label="Access Code"
          placeholder="Enter your access code"
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          onChangeText={(text) => fCheckAccessCode(text)}
        />
        <Input
          style={styles.input}
          value={username}
          label="Username"
          placeholder="Enter your username"
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          style={styles.input}
          value={password}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={true}
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          onChangeText={(text) => setPassword(text)}
        />
        <Button style={styles.button} onPress={() => fLogin()}>
          {loginLabel}
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate("LoginSSO")}>
          <Text style={styles.sso}>SSOLOGIN</Text>
        </TouchableOpacity>
      </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F7F9FC",
  },
  image: {
    width: 300,
    height: 300,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    marginBottom: 32,
  },
  input: {
    marginVertical: 8,
    width: "100%",
  },
  button: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#b6daf2",
    borderColor: "#b6daf2",
  },
  sso: {
    marginTop: 8,
    color: "#b6daf2",
  },
});

export default LoginScreen;
