import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Checkpoint, User } from '../types/types'
import { toCheckpoint } from '../functions/utils'

type FirestoreContextType = {
    user: User,
    checkPoints: Checkpoint[],
    getUser: (mail: string, password: string) => void,
}

const defaultFirestoreState: FirestoreContextType = {
    user: { firstname: '', lastname: '', age: 0, mail: '' },
    checkPoints: [],
    getUser: async () => undefined
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {

    const [user, setUser] = useState<User>({ firstname: '', lastname: '', age: 0, mail: '' })
    const [checkPoints, setCheckPoints] = useState<Checkpoint[]>([])

    useEffect(() => {
        getAllCheckpoints()
    }, [])

    const usersCollection = firestore().collection('users')
    const checkpointsCollection = firestore().collection('checkpoints')

    const getUser = async (mail: string, password: string) => {
        const users = (await usersCollection.where('mail', '==', mail).where('password', '==', password).limit(1).get()).docs
        const userData = users.map((user) => user.data())
        console.log(userData);
    }

    const getAllCheckpoints = async () => {
        const checkpoints = (await checkpointsCollection.get()).docs
        const checkpointsData = checkpoints.map((checkpoint) => toCheckpoint(checkpoint.data()))
        setCheckPoints(checkpointsData)
    }

    return (
        <FirestoreContext.Provider
            value={{
                user,
                checkPoints,
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