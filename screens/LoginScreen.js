import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Layout, Text } from "@ui-kitten/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "./ThemeContext";
//{"currpersid": 970, "geturl": "https://apps2.talonsystems.com/tseta/servlet/content?module=home&page=m&reactnative=1&accesscode=0200006733&customer=eta0000&etamobilepro=1&nocache=n"
//, "sessionid": 606691, "validated": 1}
const LoginScreen = ({ navigation }) => {
  const [accesscode, setAccesscode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLabel, setLoginLabel] = useState("LOGIN");

  const { setUrl, authUser, setAuthUser, isLoggedIn, setIsLoggedIn } =
    useAuth();

  function fCheckAccessCode(acode) {
    var ucode = acode.toUpperCase();
    if (ucode == "ERQ2013") {
      setLoginLabel("CONTINUE");
    } else {
      setLoginLabel("LOGIN");
    }
    setAccesscode(ucode);
  }

  function fLogin() {
    if (accesscode == "ERQ2013" && loginLabel == "CONTINUE") {
      navigation.navigate("LoginSSO");
    }

    if (accesscode == "") {
      Alert.alert("You must specify an Access Code.");
      return;
    }
    if (username == "") {
      Alert.alert("You must specify an User Name.");
      return;
    }
    if (password == "") {
      Alert.alert("You must specify a Password.");
      return;
    }

    const conn = ""; //checkConnection();

    if (conn == "No network connection" || conn == "Unknown connection") {
      Alert.alert("You do not have an internet connection!");
    } else {
      const svr = accesscode.substring(0, 2).replace("0", ""); //remove leading zeros from the server: 02 becomes 2
      const talProd = "https://apps" + svr + ".talonsystems.com/";
      const localAcode = accesscode;

      var schema = "";
      //ERAU DEV
      if (localAcode.substring(0, 3).toUpperCase() == "ERD") {
        schema = "";
        //ERAU QC
      } else if (localAcode.substring(0, 3).toUpperCase() == "ERQ") {
        schema = "";
        //ERAU PROD
      } else if (localAcode.substring(0, 3).toUpperCase() == "ERP") {
        schema = "";
        //FALCON
      } else if (localAcode.substring(0, 6).toUpperCase() == "TALDEV") {
        schema = "";
        //EAGLE
      } else if (localAcode.substring(0, 6).toUpperCase() == "TALTST") {
        schema = "";
      } else {
        //Talon Servers
        schema = localAcode.substring(2, 6);
      }

      if (
        accesscode.substring(0, 1).toUpperCase() != "E" &&
        isNaN(accesscode)
      ) {
        Alert.alert(
          "You have entered an invalid access code. Only numeric characters are allowed."
        );

        //not ERAU but invalid server portion of access code
      } else if (
        accesscode.substring(0, 1).toUpperCase() != "E" &&
        accesscode.substring(0, 2) != "01" &&
        accesscode.substring(0, 2) != "02" &&
        accesscode.substring(0, 2) != "03" &&
        accesscode.substring(0, 2) != "04" &&
        accesscode.substring(0, 2) != "05" &&
        accesscode.substring(0, 2) != "06" &&
        accesscode.substring(0, 2) != "07" &&
        accesscode.substring(0, 2) != "08" &&
        accesscode.substring(0, 2) != "09" &&
        accesscode.substring(0, 2) != "10" &&
        accesscode.substring(0, 2) != "11" &&
        accesscode.substring(0, 2) != "12"
      ) {
        Alert.alert("You have entered an invalid access code.");

        //not ERAU but access code not 10 chars
      } else if (
        accesscode.substring(0, 1).toUpperCase() != "E" &&
        accesscode.length != 10
      ) {
        Alert.alert("You have entered an invalid access code.");
      } else {
        var ssoLogin = 0;

        var url = "";
        var mode = "export";
        var currentTime = new Date();
        var n = currentTime.getTime() + Math.random();

        var accessCode = accesscode;

        var schema = accessCode.substring(2, 6);

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
              console.log(json);
              setAuthUser(json);
              setIsLoggedIn(true);
              //navigation.jumpTo('Home')
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
          onChangeText={(text) => fCheckAccessCode(text)}
        />
        <Input
          style={styles.input}
          value={username}
          label="Username"
          placeholder="Enter your username"
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          style={styles.input}
          value={password}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => navigation.navigate("LoginSSO")}>
          <Text>LoginSSO</Text>
        </TouchableOpacity>
        <Button style={styles.button} onPress={() => fLogin()}>
          Login
        </Button>
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
  },
});

export default LoginScreen;
