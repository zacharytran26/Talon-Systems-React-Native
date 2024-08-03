import React, { useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import { Button, ButtonGroup, Icon, Layout, Text, Avatar, Card} from '@ui-kitten/components';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const StudentList = ({ navigation }) => {
  const route  = useRoute();
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
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity appearance='ghost' style={styles.editButton} onPress={pickImage}>
              <Avatar
                source={image ? { uri: image } : profileImage}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('StudentCourse', { course: detail })}>
              <Text status='primary' style={styles.link}>Course Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('StudentMap', { course: detail })}>
              <Text status='primary' style={styles.link}>Student Course Map</Text>
            </TouchableOpacity>
            <Text category='s1' style={styles.subject}>Name: {detail.name}</Text>
            <Text category='s2' style={styles.subject}>Course: {detail.course}</Text>
            <Text category='p1' style={styles.subject}>Flight Block: {detail.block}</Text>
            <Text category='p1' style={styles.subject}>Team: {detail.team}</Text>
            <Text category='p1' style={styles.subject}>Instructor: {detail.instructor}</Text>
            <Text category='p1' style={styles.subject}>Email: {detail.email}</Text>
            <Text category='p1' style={styles.subject}>Phone: {detail.phone}</Text>
            <Text category='p1' style={styles.subject}>Registration id: {detail.persregid}</Text>
          </View>
        </SafeAreaView>
      </Layout>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  link: {
    marginVertical: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  from: {
    marginVertical: 8,
  },
  subject: {
    marginVertical: 8,
    fontSize: 20
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  contentContainer: {
    flex: 1,
  },
  profileAvatar: {
    width: 100,
    height: 100,
  },
  buttonGroupContainer: {
    justifyContent: 'flex-end',
    padding: 16,
    alignItems: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  buttonGroup: {
    margin: 2,
  },
  editButton: {
    alignItems: 'center'

  },
});

export default StudentList;
