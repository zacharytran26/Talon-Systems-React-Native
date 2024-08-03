import React, { useState, useContext} from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Router } from './routes/Route';
import { useAuth, AuthProvider } from './screens/ThemeContext';


const App = () => (
  <>
  <ApplicationProvider {...eva} theme = {eva.light}>

    <IconRegistry icons={EvaIconsPack} />
    <AuthProvider>
      <Router />
    </AuthProvider>

  </ApplicationProvider>
  </>
);

export default App;