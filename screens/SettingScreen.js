import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import { Layout, Text, Button, Icon, Toggle, Avatar, IconRegistry, ApplicationProvider } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './ThemeContext';
import * as MailComposer from 'expo-mail-composer';

const SettingsScreen = ({ navigation }) => {
  const themeContext = React.useContext(ThemeContext);
  const [form, setForm] = useState({
    darkMode: themeContext.theme === 'dark',
    emailNotifications: true,
    pushNotifications: false,
  });
  const [image, setImage] = useState(null);
  const [isAvailable, setisAvailable] = useState(false);

  useEffect(()=> {
    async function checkAvailability(){
      const isAvailable = await MailComposer.isAvailableAsync();
      setisAvailable(isAvailable);
    }

    checkAvailability()
  },[]);

  const sendMail= () => {
    MailComposer.composeAsync({
      subject: 'Problem',
      body: '',
      recipients: 'talonsystems@yahoo.com'
    });
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDarkModeToggle = (isChecked) => {
    setForm({ ...form, darkMode: isChecked });
    themeContext.toggleTheme();
  };


  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[themeContext.theme]}>
        <Layout style={styles.container}>
          <Layout style={styles.profile}>
            <Button appearance='ghost' style={styles.editButton} onPress={pickImage}>
              <Avatar
                source={{
                  uri: image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
                }}
                style={styles.profileAvatar}
              />
              <Icon
                style={styles.profileAction}
                fill='#fff'
                name='edit-outline'
              />
            </Button>
            <Text category='h6' style={styles.profileName}>John Doe</Text>
          </Layout>

          <ScrollView>
            <Layout style={styles.section}>
              <Text category='label' style={styles.sectionTitle}>Preferences</Text>

              <View style={styles.row}>
                <Layout style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <Icon style={styles.icon} fill='#fff' name='moon-outline' />
                </Layout>
                <Text style={styles.rowLabel}>Dark Mode</Text>
                <View style={styles.rowSpacer} />
                <Toggle
                  checked={form.darkMode}
                  onChange={handleDarkModeToggle}
                />
              </View>

              <View style={styles.row}>
                <Layout style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <Icon style={styles.icon} fill='#fff' name='email-outline' />
                </Layout>
                <Text style={styles.rowLabel}>Email Notifications</Text>
                <View style={styles.rowSpacer} />
                <Toggle
                  checked={form.emailNotifications}
                  onChange={emailNotifications =>
                    setForm({ ...form, emailNotifications })
                  }
                />
              </View>

              <View style={styles.row}>
                <Layout style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <Icon style={styles.icon} fill='#fff' name='bell-outline' />
                </Layout>
                <Text style={styles.rowLabel}>Push Notifications</Text>
                <View style={styles.rowSpacer} />
                <Toggle
                  checked={form.pushNotifications}
                  onChange={pushNotifications =>
                    setForm({ ...form, pushNotifications })
                  }
                />
              </View>

            </Layout>

            <Layout style={styles.section}>
              <Text category='label' style={styles.sectionTitle}>Resources</Text>

              <Button appearance='ghost' style={styles.row} onPress={sendMail} >
                <Layout style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <Icon style={styles.icon} fill='#fff' name='flag-outline' />
                </Layout>
                <View>
                  <Text style={styles.rowLabel}>Report Bug</Text>
                </View>
                <Icon style={styles.icon} fill='#C6C6C6' name='chevron-right-outline' />
              </Button>

              <Button appearance='ghost' style={styles.row} onPress={sendMail}>
                <Layout style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <Icon style={styles.icon} fill='#fff' name='email-outline' />
                </Layout>
                <View>
                  <Text style={styles.rowLabel}>Contact Us</Text>
                </View>
                <Icon style={styles.icon} fill='#C6C6C6' name='chevron-right-outline' />
              </Button>
            </Layout>

          </ScrollView>

        </Layout>
      </ApplicationProvider>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 9,
    marginBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSpacer: {
    flexGrow: 2,
    flexShrink: 2,
    flexBasis: 1,
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
  },
  editButton: {
    position: 'relative',
  },
  ButtonText: {
    textAlign: 'right',
    margin: 'auto',
  },
});

export default SettingsScreen;
