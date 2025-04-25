import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Keyboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAMPLE_RECIPES = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    type: 'plato_principal',
    author: 'Chef Mario',
    ingredients: 'Spaghetti, huevos, panceta, queso parmesano',
    instructions: '1. Cocinar la pasta...',
  },
  {
    id: '2',
    title: 'Tiramisú',
    type: 'postre',
    author: 'Chef Anna',
    ingredients: 'Queso mascarpone, huevos, café, bizcochos',
    instructions: '1. Preparar el café...',
  },
];

// Mapeo de tipos de receta a íconos
const RECIPE_TYPE_ICONS = {
  plato_principal: 'restaurant',
  postre: 'ice-cream',
  ensalada: 'leaf',
  sopa: 'cafe',
  bebida: 'wine',
  // Añade más mapeos según necesites
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const loadRecipes = async () => {
    try {
      const recipesJSON = await AsyncStorage.getItem('userRecipes');
      const userRecipes = recipesJSON ? JSON.parse(recipesJSON) : [];
      const allRecipes = [...SAMPLE_RECIPES, ...userRecipes];
      setRecipes(allRecipes);
      setFilteredRecipes(allRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes(SAMPLE_RECIPES);
      setFilteredRecipes(SAMPLE_RECIPES);
    }
  };

  useEffect(() => {
    loadRecipes();
    const unsubscribe = navigation.addListener('focus', loadRecipes);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          (recipe.author && recipe.author.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  };

  // Función para formatear el tipo de receta
  const formatRecipeType = (type) => {
    return type
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderRecipeCard = ({ item }) => {
    // Obtener el ícono correspondiente al tipo de receta o usar uno por defecto
    const typeIcon = RECIPE_TYPE_ICONS[item.type] || 'fast-food';
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <View style={styles.recipeMeta}>
            <View style={styles.metaItem}>
              <Ionicons 
                name={typeIcon} 
                size={16} 
                color="#4B5563" 
                style={styles.metaIcon} 
              />
              <Text style={styles.recipeType}>
                {formatRecipeType(item.type)}
              </Text>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>CuisineApp</Text>
        <Text style={styles.appSubtitle}>Tu colección de recetas</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar recetas o autores..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={() => Keyboard.dismiss()}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Resultados de búsqueda' : 'Todas las recetas'}
        </Text>
        
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderRecipeCard}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="sad-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No se encontraron recetas</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 6,
  },
  recipeType: {
    fontSize: 14,
    color: '#4B5563',
  },
  recipeAuthor: {
    fontSize: 14,
    color: '#4B5563',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});

export default HomeScreen;