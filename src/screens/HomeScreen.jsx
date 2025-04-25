import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const tempRecipes = [
  {
    id: "1",
    title: "Pasta Carbonara",
    type: "plato_principal",
    ingredients: "Spaghetti, huevos, panceta, queso parmesano",
    instructions: "1. Cocinar la pasta...",
  },
  {
    id: "2",
    title: "Tiramisú",
    type: "postre",
    ingredients: "Queso mascarpone, huevos, café, bizcochos",
    instructions: "1. Preparar el café...",
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(tempRecipes);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = tempRecipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.author.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(tempRecipes);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navbar Superior sin línea inferior */}
        <View style={styles.navbar}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>CuisineApp</Text>
          </View>
        </View>

        {/* Barra de Búsqueda con línea gris debajo */}
        <View>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar recetas..."
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          <View style={styles.searchUnderline} />
        </View>

        {/* Lista de Recetas */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeItem}
              onPress={() =>
                navigation.navigate("RecipeDetail", { recipe: item })
              }
            >
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeAuthor}>Por: {item.author}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>No se encontraron recetas</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    // Eliminamos borderBottomWidth
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchUnderline: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  recipeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  recipeAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default HomeScreen;
