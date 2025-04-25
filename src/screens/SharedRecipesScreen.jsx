import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SharedRecipesScreen = ({ navigation }) => {
  const [sharedRecipes, setSharedRecipes] = useState([]);

  const loadSharedRecipes = async () => {
    try {
      // Obtener el email del usuario logueado
      const userJSON = await AsyncStorage.getItem('loggedInUser');
      const user = userJSON ? JSON.parse(userJSON) : null;
      const email = user ? user.email : null;

      if (!email) {
        setSharedRecipes([]);
        return;
      }

      // Cargar recetas compartidas
      const sharedRecipesJSON = await AsyncStorage.getItem('sharedRecipes');
      const sharedRecipesData = sharedRecipesJSON ? JSON.parse(sharedRecipesJSON) : {};
      const userSharedRecipes = sharedRecipesData[email] || [];
      setSharedRecipes(userSharedRecipes);
    } catch (error) {
      console.error('Error loading shared recipes:', error);
    }
  };

  useEffect(() => {
    loadSharedRecipes();
    // Recargar cuando la pantalla recibe foco
    const unsubscribe = navigation.addListener('focus', loadSharedRecipes);
    return unsubscribe;
  }, [navigation]);

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeType}>
          Tipo: {item.type.replace('_', ' ')}
        </Text>
        <Text style={styles.recipeAuthor}>Por: {item.author || 'Desconocido'}</Text>
        <Text style={styles.sharedAt}>
          Compartido: {new Date(item.sharedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recetas Compartidas</Text>
        </View>
        <FlatList
          data={sharedRecipes}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={renderRecipeCard}
          ListEmptyComponent={
            <Text style={styles.noResults}>No tienes recetas compartidas</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recipeAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sharedAt: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default SharedRecipesScreen;