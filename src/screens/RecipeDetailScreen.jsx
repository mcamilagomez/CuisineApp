import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const loadUsers = async () => {
    try {
      // Obtener el email del usuario logueado
      const userJSON = await AsyncStorage.getItem('loggedInUser');
      const user = userJSON ? JSON.parse(userJSON) : null;
      const email = user ? user.email.trim() : null;
      setCurrentUserEmail(email);
      console.log('Usuario logueado:', { email }); // Log para depuración

      // Cargar todos los usuarios registrados
      const usersJSON = await AsyncStorage.getItem('users');
      const userList = usersJSON ? JSON.parse(usersJSON) : [];
      console.log('Usuarios registrados:', userList); // Log para depuración

      // Excluir al usuario logueado de la lista
      const filteredUsers = userList.filter(
        (u) => u.email.trim().toLowerCase() !== email?.toLowerCase()
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const shareRecipe = async () => {
    if (!selectedUser) {
      Alert.alert('Selección requerida', 'Por favor selecciona un usuario');
      return;
    }

    try {
      const sharedRecipesJSON = await AsyncStorage.getItem('sharedRecipes');
      const sharedRecipes = sharedRecipesJSON ? JSON.parse(sharedRecipesJSON) : {};

      if (!sharedRecipes[selectedUser.email]) {
        sharedRecipes[selectedUser.email] = [];
      }

      sharedRecipes[selectedUser.email].push({
        ...recipe,
        sharedAt: new Date().toISOString(),
        originalAuthor: recipe.author, // Guardar el autor original
        sharedWith: [selectedUser.email], // Indicar con quién se comparte
      });

      await AsyncStorage.setItem('sharedRecipes', JSON.stringify(sharedRecipes));
      console.log('Receta compartida con:', selectedUser.email); // Log para depuración
      console.log('sharedRecipes después de compartir:', sharedRecipes); // Log del estado

      setModalVisible(false);
      setSelectedUser(null);
      Alert.alert('Receta compartida', `La receta se compartió con ${selectedUser.email}`);
    } catch (error) {
      console.error('Error sharing recipe:', error);
      Alert.alert('Error', 'No se pudo compartir la receta');
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUser?.email === item.email && styles.userItemSelected,
      ]}
      onPress={() => setSelectedUser(item)}
    >
      <Ionicons
        name="person-circle-outline"
        size={24}
        color={selectedUser?.email === item.email ? '#4CAF50' : '#888'}
      />
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal para compartir */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un usuario</Text>
              <Ionicons
                name="close"
                size={24}
                color="#888"
                onPress={() => setModalVisible(false)}
              />
            </View>

            <FlatList
              data={users}
              keyExtractor={(item) => item.email}
              renderItem={renderUserItem}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Ionicons name="sad" size={40} color="#888" />
                  <Text style={styles.noUsersText}>
                    {currentUserEmail
                      ? 'No hay otros usuarios registrados'
                      : 'No estás logueado o no hay usuarios'}
                  </Text>
                </View>
              }
            />

            <TouchableOpacity
              style={[
                styles.shareButton,
                !selectedUser && styles.disabledButton,
              ]}
              onPress={shareRecipe}
              disabled={!selectedUser}
            >
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.shareButtonText}>Enviar receta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Encabezado con imagen de receta */}
      <View style={styles.recipeHeader}>
        <View style={styles.recipeImagePlaceholder}>
          <Ionicons name="restaurant" size={60} color="#4CAF50" />
        </View>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
      </View>

      {/* Tarjeta de información */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            {recipe.type ? recipe.type.replace('_', ' ') : 'Sin categoría'}
          </Text>
        </View>
      </View>

      {/* Sección de ingredientes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="nutrition" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Ingredientes</Text>
        </View>
        <Text style={styles.sectionContent}>{recipe.ingredients}</Text>
      </View>

      {/* Sección de preparación */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Preparación</Text>
        </View>
        <Text style={styles.sectionContent}>{recipe.instructions}</Text>
      </View>

      {/* Botón flotante para compartir */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="share-social" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    paddingBottom: 80,
  },
  recipeHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  recipeImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  userItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  userEmail: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  emptyList: {
    alignItems: 'center',
    padding: 20,
  },
  noUsersText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RecipeDetailScreen;