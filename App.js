import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { registrarNotificacoes } from './config/notifications';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import ClientesScreen from './screens/ClientesScreen';
import ChamadosScreen from './screens/ChamadosScreen';
import FaturasScreen from './screens/FaturasScreen';
import ConfigScreen from './screens/ConfigScreen';
import ClienteHomeScreen from './screens/ClienteHomeScreen';
import ClienteChamadosScreen from './screens/ClienteChamadosScreen';
import ClienteFaturasScreen from './screens/ClienteFaturasScreen';
import LibrasScreen from './screens/LibrasScreen';
import ChatbotScreen from './screens/ChatbotScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AtendenteNavigator({ usuario }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1A5276', borderTopWidth: 0, height: 90, paddingBottom: 20 },
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#AED6F1',
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen name="Home" options={{ tabBarLabel: 'Início',
        tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }}>
        {() => <HomeScreen usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen name="Clientes" options={{ tabBarLabel: 'Clientes',
        tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={22} color={color} /> }}
        component={ClientesScreen} />
      <Tab.Screen name="Chamados" options={{ tabBarLabel: 'Chamados',
        tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={22} color={color} /> }}
        component={ChamadosScreen} />
      <Tab.Screen name="Faturas" options={{ tabBarLabel: 'Faturas',
        tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }}
        component={FaturasScreen} />
      <Tab.Screen name="Libras" options={{ tabBarLabel: 'Libras',
        tabBarIcon: ({ color }) => <Ionicons name="hand-left-outline" size={22} color={color} /> }}
        component={LibrasScreen} />
      <Tab.Screen name="Config" options={{ tabBarLabel: 'Config',
        tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} /> }}
        component={ConfigScreen} />
    </Tab.Navigator>
  );
}

function ClienteNavigator({ usuario }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1A5276', borderTopWidth: 0, height: 90, paddingBottom: 20 },
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#AED6F1',
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
        }}
      >
        {(props) => <ClienteHomeScreen {...props} usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen
        name="MeusChamados"
        options={{
          tabBarLabel: 'Chamados',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={22} color={color} />
        }}
      >
        {(props) => <ClienteChamadosScreen {...props} usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen
        name="MinhasFaturas"
        options={{
          tabBarLabel: 'Faturas',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} />
        }}
      >
        {(props) => <ClienteFaturasScreen {...props} usuario={usuario} />}
      </Tab.Screen>
      <Tab.Screen name="Libras" options={{ tabBarLabel: 'Libras',
        tabBarIcon: ({ color }) => <Ionicons name="hand-left-outline" size={22} color={color} /> }}
        component={LibrasScreen} />
      <Tab.Screen name="Chatbot" options={{ tabBarLabel: 'Suporte',
        tabBarIcon: ({ color }) => <Ionicons name="chatbox-ellipses-outline" size={22} color={color} /> }}
        component={ChatbotScreen} />
      <Tab.Screen name="ConfigCliente" options={{ tabBarLabel: 'Config',
        tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} /> }}
        component={ConfigScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    registrarNotificacoes();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        const docSnap = await getDoc(doc(db, 'usuarios', user.uid));
        if (docSnap.exists()) {
          setPerfil(docSnap.data().perfil);
        } else {
          setPerfil('atendente');
        }
      } else {
        setUsuario(null);
        setPerfil(null);
      }
      setCarregando(false);
    });
    return unsub;
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#1A5276" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? (
        perfil === 'cliente' ? (
          <ClienteNavigator usuario={usuario} />
        ) : (
          <AtendenteNavigator usuario={usuario} />
        )
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}