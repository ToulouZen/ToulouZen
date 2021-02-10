import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types/types'

type FirestoreContextType = {
    user: User,
    getUser: (mail: string, password: string) => void
}

const defaultFirestoreState: FirestoreContextType = {
    user: { firstname: '', lastname: '', age: 0, mail: '' },
    getUser: async () => undefined
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {

    const [user, setUser] = useState<User>({ firstname: '', lastname: '', age: 0, mail: '' })

    const usersCollection = firestore().collection('users')

    const createUser = async (firstname: string, lastname: string, age: number, mail: string, password: string) => {
        await usersCollection.add
    }

    const getUser = async (mail: string, password: string) => {
        const users = (await usersCollection.where('mail', '==', mail).where('password', '==', password).limit(1).get()).docs
        const userData = users.map((user) => user.data())
        console.log(userData);

    }

    return (
        <FirestoreContext.Provider
            value={{
                user,
                getUser
            }}>
            {children}
        </FirestoreContext.Provider>
    )
}


export const useFirestore = () => {
    const firestore = useContext(FirestoreContext)
    return firestore
}