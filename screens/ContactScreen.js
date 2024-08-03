import React, {useEffect, useState} from 'react';
import { StyleSheet, View, SafeAreaView} from 'react-native';
import { Button, Input, Layout, Text} from '@ui-kitten/components';
import * as MailComposer from 'expo-mail-composer';


export const InputStatusShowcase = ({navigation}) => {
  const [isAvailable, setisAvialable]= useState(false);


  useEffect(() => {
    async function checkAvailability(){
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setisAvialable(isMailAvailable);
    }
    checkAvailability();
  },[]);
  const sendMail = () => {
    MailComposer.composeAsync({
      subject: '',
      body: '',
      recipients: [''],
  });



  return (
    <SafeAreaView></SafeAreaView>
  );
};
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 2,
  },
  inputTextStyle: {
    minHeight: 64,
  },
});
