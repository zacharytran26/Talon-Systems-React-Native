import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { Layout, Text, Avatar, Card, Button, Icon } from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const StudentDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const [image, setImage] = useState(null);
  const profileImage = require('../assets/person-icon.png');

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

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stickyHeader}>
          <TouchableOpacity appearance='ghost' style={styles.editButton} onPress={pickImage}>
            <Avatar
              source={image ? { uri: image } : profileImage}
              style={styles.profileAvatar}
            />
          </TouchableOpacity>
          <Text category='h1' style={styles.profileName}>{detail.name}</Text>
          <View style={styles.contactButtons}>
            <Button onPress={() => navigation.navigate('StudentCourse', { course: detail })} style={styles.contactButton} accessoryLeft={(props) => <Icon {...props} name='book-outline' />}>Course</Button>
            <Button onPress={() => navigation.navigate('StudentMap', { course: detail })} style={styles.contactButton} accessoryLeft={(props) => <Icon {...props} name='map-outline' />}>Course Map</Button>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contactInfo}>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Course</Text>
              <Text style={styles.contactInfoValue}>{detail.course}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Flight Block</Text>
              <Text style={styles.contactInfoValue}>{detail.block}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Team</Text>
              <Text style={styles.contactInfoValue}>{detail.team}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Instructor</Text>
              <Text style={styles.contactInfoValue}>{detail.instructor}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>{detail.email}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Phone</Text>
              <Text style={styles.contactInfoValue}>{detail.phone}</Text>
            </Card>
            <Card style={styles.contactInfoCard}>
              <Text style={styles.contactInfoLabel}>Registration ID</Text>
              <Text style={styles.contactInfoValue}>{detail.persregid}</Text>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  profileAvatar: {
    width: 100,
    height: 100,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  contactButton: {
    marginHorizontal: 8,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactInfoCard: {
    marginBottom: 16,
    padding: 16,
  },
  contactInfoLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfoValue: {
    fontSize: 16,
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    alignItems: 'center',
  },
});

export default StudentDetailScreen;
