import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MyRecipesScreen = ({ navigation }) => {
  // Ejemplo de recetas (puedes reemplazarlo por tus propios datos)
  const recipes = [
    {
      id: 1,
      title: 'Ensalada César',
      image: 'https://example.com/ensalada.jpg',
      type: 'entrada',
      ingredients: 'Lechuga, pollo, queso parmesano...',
      instructions: 'Mezclar todos los ingredientes y servir.',
    },
    {
      id: 2,
      title: 'Tacos al Pastor',
      image: 'https://example.com/tacos.jpg',
      type: 'plato_fuerte',
      ingredients: 'Tortillas, carne al pastor, piña...',
      instructions: 'Calentar las tortillas, agregar la carne y la piña.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>¡Hola, Bienvenido!</Text>
      <Text style={styles.title}>Tus Recetas</Text>

      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.card}
          onPress={() => navigation.navigate('RecipeDetail', { recipe })}
        >
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{recipe.title}</Text>
            <Text style={styles.cardType}>{recipe.type.replace('_', ' ')}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#444',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardType: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default MyRecipesScreen;
