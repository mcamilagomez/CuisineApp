import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const AddRecipeScreen = () => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeType, setRecipeType] = useState('entrada');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = () => {
    console.log({
      nombre: recipeName,
      tipo: recipeType,
      ingredientes: ingredients,
      instrucciones: instructions
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Nueva Receta</Text>
          <Ionicons name="restaurant" size={28} color="#4CAF50" />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre de la receta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Pastas Alfredo..."
            placeholderTextColor="#999"
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de receta</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={recipeType}
              onValueChange={setRecipeType}
              dropdownIconColor="#4CAF50"
            >
              <Picker.Item label="Entrada" value="entrada" />
              <Picker.Item label="Plato Principal" value="plato_principal" />
              <Picker.Item label="Postre" value="postre" />
              <Picker.Item label="Bebida" value="bebida" />
              <Picker.Item label="Ensalada" value="ensalada" />
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Ingredientes</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="1 taza de harina..."
            placeholderTextColor="#999"
            value={ingredients}
            onChangeText={setIngredients}
            multiline
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Instrucciones</Text>
          <TextInput
            style={[styles.input, styles.multilineInput, { height: 150 }]}
            placeholder="Paso 1: Mezclar los ingredientes..."
            placeholderTextColor="#999"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar Receta</Text>
          <Ionicons name="save" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    marginTop:25
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default AddRecipeScreen;