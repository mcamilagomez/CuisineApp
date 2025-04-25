import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const BACKUP_PATH = FileSystem.documentDirectory + 'users_backup.json';

// Modifica saveUser para hacer backup
// utils/userStorage.js
export const saveUser = async (user) => {
    try {
      const usersJSON = await AsyncStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      if (users.some(u => u.email === user.email)) {
        return { success: false, message: 'El correo ya está registrado' };
      }
  
      users.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Guarda copia en archivo visible
      await FileSystem.writeAsStringAsync(BACKUP_PATH, JSON.stringify(users, null, 2));
      
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error('Error saving user:', error);
      return { success: false, message: 'Error al registrar el usuario' };
    }
  };

// Nueva función para ver el archivo de backup
export const viewBackupFile = async () => {
  try {
    const content = await FileSystem.readAsStringAsync(BACKUP_PATH);
    console.log('Backup file content:', content);
    return content;
  } catch (error) {
    console.error('Error reading backup:', error);
    return null;
  }
};

// utils/userStorage.js
export const verifyUser = async (email, password) => {
    try {
      const usersJSON = await AsyncStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      return !!user; // Retorna true si el usuario existe, false si no
    } catch (error) {
      console.error('Error verifying user:', error);
      return false;
    }
  };

// utils/userStorage.js
export const inspectUsers = async () => {
    try {
      const usersJSON = await AsyncStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      console.log('Users in AsyncStorage:', users);
      return users;
    } catch (error) {
      console.error('Error inspecting users:', error);
      return [];
    }
  };

  
// Guardar receta para un usuario específico
export const saveUserRecipe = async (recipe) => {
    try {
      const userJSON = await AsyncStorage.getItem('loggedInUser');
      const user = userJSON ? JSON.parse(userJSON) : null;
      const author = user ? user.email : null;
      
      if (!author) {
        throw new Error('No hay usuario logueado');
      }
  
      // Guardar en recetas generales
      const allRecipesJSON = await AsyncStorage.getItem('allRecipes');
      const allRecipes = allRecipesJSON ? JSON.parse(allRecipesJSON) : [];
      allRecipes.push(recipe);
      await AsyncStorage.setItem('allRecipes', JSON.stringify(allRecipes));
  
      // Guardar en recetas del usuario específico
      const userKey = `userRecipes_${author}`;
      const userRecipesJSON = await AsyncStorage.getItem(userKey);
      const userRecipes = userRecipesJSON ? JSON.parse(userRecipesJSON) : [];
      userRecipes.push(recipe);
      await AsyncStorage.setItem(userKey, JSON.stringify(userRecipes));
  
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      return false;
    }
  };
  
  // Obtener recetas de un usuario específico
  export const getUserRecipes = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('loggedInUser');
      const user = userJSON ? JSON.parse(userJSON) : null;
      const email = user ? user.email : null;
  
      if (!email) {
        return [];
      }
  
      const userKey = `userRecipes_${email}`;
      const recipesJSON = await AsyncStorage.getItem(userKey);
      return recipesJSON ? JSON.parse(recipesJSON) : [];
    } catch (error) {
      console.error('Error getting user recipes:', error);
      return [];
    }
  };