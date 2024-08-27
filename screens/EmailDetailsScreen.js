import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button, ButtonGroup, Icon, Layout, Text } from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;
const FolderIcon = (props) => <Icon {...props} name="folder-outline" />;
const ReplyIcon = (props) => <Icon {...props} name="corner-up-left-outline" />;

const EmailList = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  const { authUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  useEffect(() => {
    setMessages([email]);
  }, [email]);

  const removeItem = (id) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
    setDeletedItems((prevDeletedItems) => [...prevDeletedItems, id]);
  };

  const archiveEmails = async (id) => {
    const querystring = `${authUser.host}content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=${authUser.sessionid}&customer=eta0000&mode=archivemessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&msgid=${id}`;
    try {
      const response = await fetch(querystring);
      const data = await response.json();
    } catch (error) {
      console.error("Error archiving email:", error);
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.emailHeader}>
          <View style={styles.emailHeaderText}>
            <Text category="s1">From:</Text>
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
              archiveEmails(email.id);
              removeItem(email.id);
              navigation.goBack();
            }}
          />
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
    backgroundColor: "#F7F9FC",
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emailHeaderText: {
    flexDirection: "column",
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
    backgroundColor: "#b6daf2",
  },
});

export default EmailList;
