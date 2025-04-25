import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={recipe.image} style={styles.recipeImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Tipo de receta</Text>
          </View>
          {/* Verificamos si recipe.type existe antes de intentar modificarlo */}
          <Text style={styles.sectionText}>
            {recipe.type ? recipe.type.replace('_', ' ') : 'Tipo no disponible'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="nutrition" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>
          <Text style={styles.sectionText}>{recipe.ingredients}</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Preparación</Text>
          </View>
          <Text style={styles.sectionText}>{recipe.instructions}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#444',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    paddingLeft: 30,
  },
});

export default RecipeDetailScreen;
