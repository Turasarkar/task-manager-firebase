import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import {
  CallsScreen,
  HomeScreen,
  ProfileScreen,
  SettingsScreen,
} from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailsScreen from "./screens/details";
import { useAuth } from "./store";
import LoginScreen from "./screens/login";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const authStack = createNativeStackNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        tabBarShowLabel: false,
        tabBarStyle: { height: 60, borderColor: "#fff" },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/profile.png")} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Calls",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/settingsicn.png")} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/call.png")} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/message.png")} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { user, setUser } = useAuth();
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? (
        <Stack.Navigator
          initialRouteName="main"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={MyTabs} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      ) : (
        <authStack.Navigator
          initialRouteName="login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <authStack.Screen name="login" component={LoginScreen} />
        </authStack.Navigator>
      )}
    </NavigationContainer>
  );
}
