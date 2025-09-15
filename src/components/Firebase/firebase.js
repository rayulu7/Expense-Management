// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, setDoc, query, where, orderBy, Timestamp, serverTimestamp } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection references
export const expensesCollection = collection(db, "expenses");
export const categoriesCollection = collection(db, "categories");
export const usersCollection = collection(db, "users");

// Helper functions for expenses
export const addExpense = async (expenseData) => {
  return await addDoc(expensesCollection, {
    ...expenseData,
    status: expenseData.status || "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId: auth.currentUser.uid
  });
};

export const updateExpense = async (id, expenseData) => {
  const expenseRef = doc(db, "expenses", id);
  return await updateDoc(expenseRef, {
    ...expenseData,
    updatedAt: serverTimestamp()
  });
};

export const deleteExpense = async (id) => {
  const expenseRef = doc(db, "expenses", id);
  return await deleteDoc(expenseRef);
};

export const getExpense = async (id) => {
  const expenseRef = doc(db, "expenses", id);
  const expenseSnap = await getDoc(expenseRef);
  if (expenseSnap.exists()) {
    return { id: expenseSnap.id, ...expenseSnap.data() };
  }
  return null;
};

export const getUserExpenses = async (filters = {}) => {
  const userId = filters.userId || auth.currentUser.uid;
  let q = query(expensesCollection, where("userId", "==", userId));
  
  // Apply filters if provided
  if (filters.category) {
    q = query(q, where("category", "==", filters.category));
  }
  
  if (filters.status) {
    q = query(q, where("status", "==", filters.status));
  }
  
  if (filters.startDate && filters.endDate) {
    q = query(q, 
      where("date", ">=", filters.startDate),
      where("date", "<=", filters.endDate)
    );
  }
  
  // Apply sorting
  const sortField = filters.sortBy || "date";
  const sortDirection = filters.sortDirection || "desc";
  q = query(q, orderBy(sortField, sortDirection));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper functions for categories
export const addCategory = async (categoryData) => {
  return await addDoc(categoriesCollection, {
    ...categoryData,
    createdAt: serverTimestamp(),
    userId: auth.currentUser.uid
  });
};

export const updateCategory = async (id, categoryData) => {
  const categoryRef = doc(db, "categories", id);
  return await updateDoc(categoryRef, {
    ...categoryData,
    updatedAt: serverTimestamp()
  });
};

export const deleteCategory = async (id) => {
  const categoryRef = doc(db, "categories", id);
  return await deleteDoc(categoryRef);
};

export const getUserCategories = async () => {
  const userId = auth.currentUser.uid;
  const q = query(categoriesCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function for approvals
export const updateExpenseStatus = async (id, status) => {
  const expenseRef = doc(db, "expenses", id);
  return await updateDoc(expenseRef, {
    status,
    updatedAt: serverTimestamp()
  });
};

// Helper function for getting pending approvals
export const getPendingApprovals = async () => {
  const userId = auth.currentUser.uid;
  const q = query(
    expensesCollection, 
    where("userId", "==", userId),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function for getting monthly/yearly summaries
export const getExpenseSummary = async (period = "monthly") => {
  const userId = auth.currentUser.uid;
  const now = new Date();
  let startDate;
  
  if (period === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    throw new Error("Invalid period. Use 'monthly' or 'yearly'");
  }
  
  const q = query(
    expensesCollection,
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", now),
    orderBy("date", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function for budget alerts
export const checkBudgetAlerts = async () => {
  const userId = auth.currentUser.uid;
  const categories = await getUserCategories();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const alerts = [];
  
  for (const category of categories) {
    if (!category.budget) continue;
    
    const q = query(
      expensesCollection,
      where("userId", "==", userId),
      where("category", "==", category.name),
      where("date", ">=", startOfMonth),
      where("date", "<=", now)
    );
    
    const querySnapshot = await getDocs(q);
    const expenses = querySnapshot.docs.map(doc => doc.data());
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetLimit = category.budget;
    const percentUsed = (totalSpent / budgetLimit) * 100;
    
    if (percentUsed >= 80) {
      alerts.push({
        category: category.name,
        budget: budgetLimit,
        spent: totalSpent,
        percentUsed,
        severity: percentUsed >= 100 ? "high" : "medium"
      });
    }
  }
  
  return alerts;
};

// Helper functions for users
export const addUser = async (userData) => {
  return await addDoc(usersCollection, {
    ...userData,
    createdAt: serverTimestamp()
  });
};

export const setUser = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  return await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
};

export const getUser = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper function to update user budget and spent amount
export const updateUserStats = async (userId, budget = null, spent = null) => {
  try {
    const userRef = doc(db, "users", userId);
    const updateData = {};

    if (budget !== null) {
      updateData.budget = budget;
    }

    if (spent !== null) {
      updateData.totalSpent = spent;
      updateData.updatedAt = serverTimestamp();
    }

    // Use setDoc with merge to handle cases where user document doesn't exist
    return await setDoc(userRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Helper function to calculate total budget from user's categories
export const calculateUserTotalBudget = async (userId) => {
  try {
    const q = query(categoriesCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map(doc => doc.data());
    const totalBudget = categories.reduce((sum, category) => sum + (category.budget || 0), 0);
    return totalBudget;
  } catch (error) {
    console.error('Error calculating user total budget:', error);
    return 0;
  }
};

// Helper function to calculate and update user's total spent and budget
export const calculateAndUpdateUserStats = async (userId) => {
  try {
    // Calculate total spent
    const expensesQ = query(expensesCollection, where("userId", "==", userId));
    const expensesSnapshot = await getDocs(expensesQ);
    const expenses = expensesSnapshot.docs.map(doc => doc.data());
    const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    // Calculate total budget from categories
    const totalBudget = await calculateUserTotalBudget(userId);

    await updateUserStats(userId, totalBudget, totalSpent);
    return { totalBudget, totalSpent };
  } catch (error) {
    console.error('Error calculating and updating user stats:', error);
    throw error;
  }
};

// Keep the old function for backward compatibility
export const calculateAndUpdateUserSpent = async (userId) => {
  const result = await calculateAndUpdateUserStats(userId);
  return result.totalSpent;
};