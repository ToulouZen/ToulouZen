import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { MMKVStorage } from 'common/storage';
import { RootStackParamsList } from 'common/types/types';
import {
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

type UserInfo = {
  firstname: string | undefined;
  lastname: string | undefined;
  mail: string | undefined;
  userType: string | undefined;
};
// Variables qui doivent être mises à disposition lors de l'utilisation du contexte
type AuthContextType = {
  isSignedIn: boolean;
  user?: FirebaseAuthTypes.User | { uid: string | undefined };
  userInfo?: UserInfo;
  register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    userType: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserInfo: () => void;
  updateUser: (
    mail: string,
    firstname: string,
    lastname: string,
    userType: string,
    password: string,
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
    user?: FirebaseAuthTypes.User | { uid: string | undefined };
    isSignedIn: boolean;
  }>({
    isSignedIn: false,
  });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstname: '',
    lastname: '',
    mail: '',
    userType: '',
  });

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
    userType: string,
  ) => {
    const registerWithEmailAndPassword =
      await firebaseAuth().createUserWithEmailAndPassword(email, password);
    usersCollection
      .doc(registerWithEmailAndPassword.user.uid)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          usersCollection.doc(registerWithEmailAndPassword.user.uid).set({
            uid: registerWithEmailAndPassword.user.uid,
            mail: registerWithEmailAndPassword.user.email,
            firstname,
            lastname,
            userType,
          });
          setUserInfo({ firstname, lastname, mail: email, userType });
          MMKVStorage.set(
            TOULOUZEN_USER_ID,
            registerWithEmailAndPassword.user.uid,
          );
          MMKVStorage.set(TOULOUZEN_FIRST_NAME, firstname);
          MMKVStorage.set(TOULOUZEN_LAST_NAME, lastname);
          MMKVStorage.set(TOULOUZEN_EMAIL, email);
          MMKVStorage.set(TOULOUZEN_USER_TYPE, userType);
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
      .then(documentSnapshot => {
        const data = documentSnapshot.data();
        setUserInfo({
          firstname: data?.firstname,
          lastname: data?.lastname,
          mail: data?.mail,
          userType: data?.userType,
        });

        MMKVStorage.set(TOULOUZEN_USER_ID, signInWithEmailAndPassword.user.uid);
        MMKVStorage.set(TOULOUZEN_FIRST_NAME, data?.firstname);
        MMKVStorage.set(TOULOUZEN_LAST_NAME, data?.lastname);
        MMKVStorage.set(TOULOUZEN_EMAIL, email);
        MMKVStorage.set(TOULOUZEN_USER_TYPE, data?.userType);
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
    userType: string,
    password: string,
  ) => {
    firebaseAuth().currentUser?.updateEmail(mail);
    if (password) {
      firebaseAuth().currentUser?.updatePassword(password);
    }
    usersCollection
      .doc(auth.user!.uid!)
      .set({ mail, firstname, lastname, userType })
      .then(() => {
        setUserInfo({
          firstname: firstname,
          lastname: lastname,
          mail: mail,
          userType: userType,
        });
        MMKVStorage.set(TOULOUZEN_FIRST_NAME, firstname);
        MMKVStorage.set(TOULOUZEN_LAST_NAME, lastname);
        MMKVStorage.set(TOULOUZEN_EMAIL, mail);
        MMKVStorage.set(TOULOUZEN_USER_TYPE, userType);
      });
  };

  // Méthode de contexte permettant de capter la déconnexion à Firebase d'une utilisatrice
  const signOut = async () => {
    await firebaseAuth().signOut();
  };

  // Méthode de contexte permettant de récupérer les données d'une utilisatrice
  const getUserInfo = () => {
    const uid = MMKVStorage.getString(TOULOUZEN_USER_ID);
    const firstname = MMKVStorage.getString(TOULOUZEN_FIRST_NAME);
    const lastname = MMKVStorage.getString(TOULOUZEN_LAST_NAME);
    const mail = MMKVStorage.getString(TOULOUZEN_EMAIL);
    const userType = MMKVStorage.getString(TOULOUZEN_USER_TYPE);
    setAuth({ user: { uid: uid }, isSignedIn: true });
    setUserInfo({ firstname, lastname, mail, userType });
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
