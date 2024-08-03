import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import {
  Button,
  ButtonGroup,
  Icon,
  Layout,
  Text,
  Avatar,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;

const FolderIcon = (props) => <Icon {...props} name="folder-outline" />;

const ReplyIcon = (props) => <Icon {...props} name="corner-up-left-outline" />;

const EmailList = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  const { removeItem } = route.params || {};

  useEffect(() => {
    navigation.setOptions({
      removeItem: () => {
        navigation.navigate("MessagesScreen", {
          removeItemId: email.id,
        });
      },
    });
  }, [navigation, email]);

  const archiveEmails = async () => {
    const querystring = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=606327&customer=eta0000&mode=archivemessage&etamobilepro=1&nocache=n&persid=970&msgid=${email.id}`;
    try {
      const response = await fetch(querystring);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error archiving email:", error);
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.emailHeader}>
          <View style={styles.emailHeaderText}>
            <Text category="s5">From:</Text>
            <Text category="h3">{email.from}</Text>
            <Text appearance="hint">{email.date}</Text>
          </View>
        </View>
        <Text category="s1" style={styles.message}>
          {email.message}
        </Text>
        <Text category="p1" style={styles.body}>
          {email.body}
        </Text>
      </SafeAreaView>
      <View style={styles.contentContainer}></View>
      <View style={styles.buttonGroupContainer}>
        <ButtonGroup style={styles.buttonGroup} size="giant">
          <Button
            accessoryLeft={TrashIcon}
            onPress={() => {
              if (removeItem) {
                archiveEmails();
                removeItem(email.id);
                navigation.navigate("Message");
              } else {
                alert("No function passed");
              }
            }}
          />
          <Button accessoryLeft={FolderIcon} />
          <Button
            accessoryLeft={ReplyIcon}
            onPress={() => navigation.navigate("ReplyScreen", { email: email })}
          />
        </ButtonGroup>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  emailHeaderText: {
    flexDirection: "column",
  },
  date: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  from: {
    marginVertical: 8,
  },
  message: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  body: {
    marginVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  buttonGroupContainer: {
    justifyContent: "flex-end",
    padding: 16,
    alignItems: "center",
  },
  buttonGroup: {
    margin: 2,
  },
});

export default EmailList;
