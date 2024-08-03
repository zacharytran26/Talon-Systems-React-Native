import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button, ButtonGroup, Icon, Layout, Text } from "@ui-kitten/components";
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
    querystring =
      `${authUser.host}` +
      `content?module=home&page=m&reactnative=1&accesscode=0200006733&uname=duser&password=1234&session_id=606327&customer=eta0000&mode=archivemessage&etamobilepro=1&nocache=n&persid=970&msgid=${email.id}`;
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
        <View style={styles.header}>
          <Button
            size="small"
            appearance="ghost"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            Back
          </Button>
        </View>
        <Text category="h1">Email Details</Text>
        <Text category="s1" style={styles.date}>
          Date: {email.date}
        </Text>
        <Text category="s2" style={styles.from}>
          From: {email.from}
        </Text>
        <Text category="p1" style={styles.subject}>
          {email.message}
        </Text>
        <Text category="p1" style={styles.body}>
          {email.body}
        </Text>
        <Text category="p1" style={styles.body}>
          ID: {email.id}
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
                navigation.naviagate("Message");
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
  date: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  from: {
    marginVertical: 8,
  },
  subject: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  body: {
    marginVertical: 8,
  },
  backButton: {
    marginRight: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 24,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
