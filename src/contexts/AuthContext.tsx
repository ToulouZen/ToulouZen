import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from 'common/types/types';
import {
  TOULOUZEN_AGE,
  TOULOUZEN_EMAIL,
  TOULOUZEN_FIRST_NAME,
  TOULOUZEN_LAST_NAME,
  TOULOUZEN_USER_ID,
  TOULOUZEN_USER_TYPE,
} from 'constants/Constants';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { handleAuthErrors } from 'utils/utils';

// Variables qui doivent être mises à disposition lors de l'utilisation du contexte
type AuthContextType = {
  isSignedIn: boolean;
  user?: FirebaseAuthTypes.User | { uid: string | null };
  userInfo?: {
    firstname: string | null;
    lastname: string | null;
    mail: string | null;
    age: number | null;
    userType: string | null;
  };
  register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    age: number,
    userType: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserInfo: () => Promise<void>;
  updateUser: (
    mail: string,
    firstname: string,
    lastname: string,
    age: number,
    userType: string,
  ) => Promise<void>;
  resetPassword: (
    mail: string,
    navigation: StackNavigationProp<RootStackParamsList, 'PasswordReset'>,
  ) => void;
};

// Valeurs par défaut des variables à mettre à disposition
const defaultAuthState: AuthContextType = {
  isSignedIn: false,
  register: async () => undefined,
  signIn: async () => undefined,
  signOut: async () => undefined,
  getUserInfo: async () => undefined,
  updateUser: async () => undefined,
  resetPassword: () => undefined,
};

const AuthContext = createContext<AuthContextType>(defaultAuthState);

export const AuthContextProvider: FC = ({ children }) => {
  const [auth, setAuth] = useState<{
    user?: FirebaseAuthTypes.User | { uid: string | null };
    isSignedIn: boolean;
  }>({
    isSignedIn: false,
  });
  const [userInfo, setUserInfo] = useState<{
    firstname: string | null;
    lastname: string | null;
    mail: string | null;
    age: number | null;
    userType: string | null;
  }>({ firstname: '', lastname: '', mail: '', age: 0, userType: '' });

  // Constante qui permet de faire le lien vers la collection "users" de la base de données Firestore (voir Firebase)
  const usersCollection = firestore().collection('users');

  useEffect(() => {
    const unsubscribe = firebaseAuth().onAuthStateChanged(_user => {
      if (_user) {
        // user is logged in
        setAuth({
          user: _user,
          isSignedIn: true,
        });
        getUserInfo();
      } else {
        // user is logged out
        setAuth({
          user: undefined,
          isSignedIn: false,
        });
      }
    });

    return unsubscribe;
  }, []);

  // Méthode de contexte permettant la création du compte d'une utilisatrice
  const register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    age: number,
    userType: string,
  ) => {
    const registerWithEmailAndPassword =
      await firebaseAuth().createUserWithEmailAndPassword(email, password);
    usersCollection
      .doc(registerWithEmailAndPassword.user.uid)
      .get()
      .then(async documentSnapshot => {
        if (!documentSnapshot.exists) {
          usersCollection.doc(registerWithEmailAndPassword.user.uid).set({
            uid: registerWithEmailAndPassword.user.uid,
            mail: registerWithEmailAndPassword.user.email,
            firstname,
            lastname,
            age,
            userType,
          });
          setUserInfo({ firstname, lastname, mail: email, age, userType });
          await AsyncStorage.setItem(
            TOULOUZEN_USER_ID,
            registerWithEmailAndPassword.user.uid,
          );
          await AsyncStorage.setItem(TOULOUZEN_FIRST_NAME, firstname);
          await AsyncStorage.setItem(TOULOUZEN_LAST_NAME, lastname);
          await AsyncStorage.setItem(TOULOUZEN_EMAIL, email);
          await AsyncStorage.setItem(TOULOUZEN_AGE, age.toString());
          await AsyncStorage.setItem(TOULOUZEN_USER_TYPE, userType);
        }
      })
      .catch(e => {
        handleAuthErrors(e);
        console.error(e);
      });
  };

  // Méthode de contexte permettant la connexion d'une utilisatrice
  const signIn = async (email: string, password: string) => {
    const signInWithEmailAndPassword =
      await firebaseAuth().signInWithEmailAndPassword(email, password);
    usersCollection
      .doc(signInWithEmailAndPassword.user.uid)
      .get()
      .then(async documentSnapshot => {
        const data = documentSnapshot.data();
        setUserInfo({
          firstname: data?.firstname,
          lastname: data?.lastname,
          mail: data?.mail,
          age: data?.age,
          userType: data?.userType,
        });

        await AsyncStorage.setItem(
          TOULOUZEN_USER_ID,
          signInWithEmailAndPassword.user.uid,
        );
        await AsyncStorage.setItem(TOULOUZEN_FIRST_NAME, data?.firstname);
        await AsyncStorage.setItem(TOULOUZEN_LAST_NAME, data?.lastname);
        await AsyncStorage.setItem(TOULOUZEN_EMAIL, email);
        await AsyncStorage.setItem(TOULOUZEN_AGE, data?.age.toString());
        await AsyncStorage.setItem(TOULOUZEN_USER_TYPE, data?.userType);
      })
      .then(() => {
        getUserInfo();
      })
      .catch(e => {
        handleAuthErrors(e);
        console.error(e);
      });
  };

  // Méthode de contexte permettant la mise à jour de l'adresse mail d'une utilisatrice
  const updateUser = async (
    mail: string,
    firstname: string,
    lastname: string,
    age: number,
    userType: string,
  ) => {
    firebaseAuth().currentUser?.updateEmail(mail);
    usersCollection
      .doc(auth.user!.uid!)
      .set({ mail, firstname, lastname, age, userType })
      .then(async () => {
        setUserInfo({
          firstname: firstname,
          lastname: lastname,
          mail: mail,
          age: age,
          userType: userType,
        });
        await AsyncStorage.setItem(TOULOUZEN_FIRST_NAME, firstname);
        await AsyncStorage.setItem(TOULOUZEN_LAST_NAME, lastname);
        await AsyncStorage.setItem(TOULOUZEN_EMAIL, mail);
        await AsyncStorage.setItem(TOULOUZEN_AGE, age.toString());
        await AsyncStorage.setItem(TOULOUZEN_USER_TYPE, userType);
      });
  };

  // Méthode de contexte permettant de capter la déconnexion à Firebase d'une utilisatrice
  const signOut = async () => {
    await firebaseAuth().signOut();
  };

  // Méthode de contexte permettant de récupérer les données d'une utilisatrice
  const getUserInfo = async () => {
    const uid = await AsyncStorage.getItem(TOULOUZEN_USER_ID);
    const firstname = await AsyncStorage.getItem(TOULOUZEN_FIRST_NAME);
    const lastname = await AsyncStorage.getItem(TOULOUZEN_LAST_NAME);
    const mail = await AsyncStorage.getItem(TOULOUZEN_EMAIL);
    const age = await AsyncStorage.getItem(TOULOUZEN_AGE);
    const userType = await AsyncStorage.getItem(TOULOUZEN_USER_TYPE);
    setAuth({ user: { uid: uid }, isSignedIn: true });
    setUserInfo({ firstname, lastname, mail, age: Number(age), userType });
  };

  // Méthode de contexte permettant l'envoi d'un e-mail pour effectuer la mise à jour du mot de passe d'une utilisatrice
  const resetPassword = async (
    mail: string,
    navigation: StackNavigationProp<RootStackParamsList, 'PasswordReset'>,
  ) => {
    navigation.goBack();
    return firebaseAuth().sendPasswordResetEmail(mail);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: auth.isSignedIn,
        user: auth.user,
        userInfo: userInfo,
        register,
        signIn,
        signOut,
        getUserInfo,
        updateUser,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
