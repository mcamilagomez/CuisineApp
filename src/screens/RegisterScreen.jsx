import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from "react-native";
import { saveUser, verifyUser, inspectUsers, viewBackupFile } from '../utils/userStorage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Validaciones básicas
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Registrar usuario
      console.log('Intentando registrar usuario:', { email });
      const result = await saveUser({ email, password });
      console.log('Resultado de saveUser:', result);

      if (result.success) {
        // Depuración (manejar errores para no detener el flujo)
        console.log('Usuario registrado, inspeccionando datos...');
        try {
          await inspectUsers();
          await viewBackupFile();
        } catch (debugError) {
          console.warn('Error en funciones de depuración:', debugError);
        }

        // Autenticar al usuario automáticamente
        console.log('Intentando autenticar usuario...');
        const isValidUser = await verifyUser(email, password);
        console.log('Resultado de verifyUser:', isValidUser);

        if (isValidUser) {
          console.log('Autenticación exitosa, navegando a MainTabs...');
          navigation.replace('MainTabs');
        } else {
          console.error('Fallo en autenticación automática');
          Alert.alert('Error', 'No se pudo autenticar automáticamente. Por favor, inicia sesión manualmente.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]);
        }
      } else {
        console.error('Error en registro:', result.message);
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error en handleRegister:', error);
      Alert.alert('Error', 'Ocurrió un error durante el registro');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="padding" 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});