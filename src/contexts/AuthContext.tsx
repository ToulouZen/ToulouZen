import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createContext, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { RootStackParamsList } from '../types/types';

type AuthContextType = {
    isSignedIn: boolean;
    user?: FirebaseAuthTypes.User | { uid: string | null };
    userInfo?: { firstname: string | null, lastname: string | null, mail: string | null, age: number | null, userType: string | null }
    register: (email: string, password: string, firstname: string, lastname: string, age: number, userType: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getUserInfo: () => void,
    updateUser: (mail: string, firstname: string, lastname: string, age: number, userType: string) => Promise<void>,
    resetPassword: (mail: string, navigation: StackNavigationProp<RootStackParamsList, "PasswordReset">) => void
}

const defaultAuthState: AuthContextType = {
    isSignedIn: true,
    register: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
    getUserInfo: async () => undefined,
    updateUser: async () => undefined,
    resetPassword: () => undefined
}

const AuthContext = createContext<AuthContextType>(defaultAuthState)

export const AuthContextProvider: React.FC = ({ children }) => {

    const [auth, setAuth] = React.useState<{ user?: FirebaseAuthTypes.User | { uid: string | null }; isSignedIn: boolean }>({
        isSignedIn: false,
    })
    const [userInfo, setUserInfo] = React.useState<{ firstname: string | null, lastname: string | null, mail: string | null, age: number | null, userType: string | null }>({ firstname: '', lastname: '', mail: '', age: 0, userType: '' })

    const usersCollection = firestore().collection('users')

    useEffect(() => {
        const unsubscribe = firebaseAuth().onAuthStateChanged((_user) => {
            if (_user) {
                // user is logged in

                setAuth({
                    user: _user,
                    isSignedIn: true
                })
            } else {
                // user is logged out
                setAuth({
                    user: undefined,
                    isSignedIn: false
                })
            }
        })

        return unsubscribe
    }, [])

    const register = async (email: string, password: string, firstname: string, lastname: string, age: number, userType: string) => {
        const register = await firebaseAuth().createUserWithEmailAndPassword(email, password)
        usersCollection.doc(register.user.uid).get()
            .then(async (documentSnapshot) => {

                if (!documentSnapshot.exists) {
                    usersCollection.doc(register.user.uid).set({ uid: register.user.uid, mail: register.user.email, firstname, lastname, age, userType })
                    setUserInfo({ firstname, lastname, mail: email, age, userType })
                    await AsyncStorage.setItem('ToulouzenUserUID', register.user.uid)
                    await AsyncStorage.setItem('ToulouzenFirstname', firstname)
                    await AsyncStorage.setItem('ToulouzenLastname', lastname)
                    await AsyncStorage.setItem('ToulouzenEmail', email)
                    await AsyncStorage.setItem('ToulouzenAge', age.toString())
                    await AsyncStorage.setItem('ToulouzenUserType', userType)

                }
            }).catch(e => {
                if (e.code == "auth/user-not-found") {
                    Alert.alert('Utilisateur', 'Ce compte n\'existe pas !')
                }
                if (e.code == "auth/wrong-password") {
                    Alert.alert('Mot de passe', 'Le mot de passe est incorrecte !')
                }
                if (e.code == 'auth/email-already-in-use') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est déjà utilisée !')
                }
                if (e.code == 'auth/invalid-email') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est invalide !');
                }
                if (e.code == 'auth/weak-password') {
                    Alert.alert('Mot de passe', 'Le mot de passe utilisé est trop faible, privilégiez 8 caractères au minimum, en ajoutant des chiffres, majuscules et caractères spéciaux');
                }
                console.error(e)
            })
    }

    const signIn = async (email: string, password: string) => {
        const signIn = await firebaseAuth().signInWithEmailAndPassword(email, password)
        usersCollection.doc(signIn.user.uid).get()
            .then(async (documentSnapshot) => {
                const data = documentSnapshot.data()
                setUserInfo({ firstname: data?.firstname, lastname: data?.lastname, mail: data?.mail, age: data?.age, userType: data?.userType })

                await AsyncStorage.setItem('ToulouzenUserUID', signIn.user.uid)
                await AsyncStorage.setItem('ToulouzenFirstname', data?.firstname)
                await AsyncStorage.setItem('ToulouzenLastname', data?.lastname)
                await AsyncStorage.setItem('ToulouzenEmail', email)
                await AsyncStorage.setItem('ToulouzenAge', data?.age.toString())
                await AsyncStorage.setItem('ToulouzenUserType', data?.userType)
            })
            .then(() => {
                getUserInfo()
            })
            .catch(e => {
                if (e.code == "auth/user-not-found") {
                    Alert.alert('Utilisateur', 'Ce compte n\'existe pas !')
                }
                if (e.code == "auth/wrong-password") {
                    Alert.alert('Mot de passe', 'Le mot de passe est incorrecte !')
                }
                if (e.code == 'auth/email-already-in-use') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est déjà utilisée !')
                }
                if (e.code == 'auth/invalid-email') {
                    Alert.alert('Adresse e-mail', 'Cette adresse e-mail est invalide !');
                }
                if (e.code == 'auth/weak-password') {
                    Alert.alert('Mot de passe', 'Le mot de passe utilisé est trop faible, privilégiez 8 caractères au minimum, en ajoutant des chiffres, majuscules et caractères spéciaux');
                }
                console.error(e)
            })
    }

    const updateUser = async (mail: string, firstname: string, lastname: string, age: number, userType: string) => {
        firebaseAuth().currentUser?.updateEmail(mail)
        usersCollection.doc(auth.user!.uid!).set({ mail, firstname, lastname, age, userType })
            .then(async () => {
                setUserInfo({ firstname: firstname, lastname: lastname, mail: mail, age: age, userType: userType })
                await AsyncStorage.setItem('ToulouzenFirstname', firstname)
                await AsyncStorage.setItem('ToulouzenLastname', lastname)
                await AsyncStorage.setItem('ToulouzenEmail', mail)
                await AsyncStorage.setItem('ToulouzenAge', age.toString())
                await AsyncStorage.setItem('ToulouzenUserType', userType)
            })
    }

    const signOut = async () => {
        await firebaseAuth().signOut()
    }

    const getUserInfo = async () => {
        const uid = await AsyncStorage.getItem('ToulouzenUserUID')
        const firstname = await AsyncStorage.getItem('ToulouzenFirstname')
        const lastname = await AsyncStorage.getItem('ToulouzenLastname')
        const mail = await AsyncStorage.getItem('ToulouzenEmail')
        const age = await AsyncStorage.getItem('ToulouzenAge')
        const userType = await AsyncStorage.getItem('ToulouzenUserType')
        setAuth({ user: { uid: uid }, isSignedIn: true })
        setUserInfo({ firstname, lastname, mail, age: Number(age), userType })
    }

    const resetPassword = async (mail: string, navigation: StackNavigationProp<RootStackParamsList, "PasswordReset">) => {
        navigation.goBack()
        return firebaseAuth().sendPasswordResetEmail(mail)
    }

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
                resetPassword
            }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}