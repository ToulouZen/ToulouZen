import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect } from 'react';

type AuthContextType = {
    isSignedIn: boolean;
    user?: FirebaseAuthTypes.User | { uid: string | null };
    userInfo?: { firstname: string | null, lastname: string | null, mail: string | null, age: number | null, userType: string | null }
    register: (email: string, password: string, firstname: string, lastname: string, age: number, userType: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getUserInfo: () => void
}

const defaultAuthState: AuthContextType = {
    isSignedIn: true,
    register: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
    getUserInfo: async () => undefined
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
        // console.log(email, password, firstname, lastname, age);

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

                }
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

    return (
        <AuthContext.Provider
            value={{
                isSignedIn: auth.isSignedIn,
                user: auth.user,
                userInfo: userInfo,
                register,
                signIn,
                signOut,
                getUserInfo
            }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}