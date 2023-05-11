import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import Routes from "./src/Routes";
import AuthProvider from "./src/contexts/auth";
import RealmContextProvider from "./src/contexts/RealmContext";
function App() {
  return (
    <NavigationContainer>
      <RealmContextProvider>
        <AuthProvider>
          <StatusBar hidden={true} />
          <Routes />
        </AuthProvider>
      </RealmContextProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);
