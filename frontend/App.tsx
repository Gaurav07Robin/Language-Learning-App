import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import useAuthStore from './src/store/useAuthStore';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import UnitScreen from './src/screens/UnitScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isAuthenticated, loadAuthStatus } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadAuthStatus().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            {!isAuthenticated ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
              <>
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen 
                  name="Unit" 
                  component={UnitScreen} 
                  options={{ presentation: 'modal' }} 
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
