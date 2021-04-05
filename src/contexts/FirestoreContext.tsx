import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Checkpoint, Path, User } from '../types/types'
import { toCheckpoint, toPath } from '../functions/utils'
import { useAuth } from './AuthContext'

type FirestoreContextType = {
    checkPoints: Checkpoint[],
    createPath: (departureDestination: Checkpoint, arrivalDestination: Checkpoint, timeDeparture: string, distance: number, duration: number) => void
    paths: Path[]
}

const defaultFirestoreState: FirestoreContextType = {
    checkPoints: [],
    createPath: async () => undefined,
    paths: []
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {

    const [checkPoints, setCheckPoints] = useState<Checkpoint[]>([])
    const [paths, setPaths] = useState<Path[]>([])

    const auth = useAuth()

    useEffect(() => {
        getAllCheckpoints()
        getPaths()
    }, [])

    const checkpointsCollection = firestore().collection('checkpoints')
    const pathsCollection = firestore().collection('paths')

    const getAllCheckpoints = async () => {
        const checkpoints = (await checkpointsCollection.get()).docs
        const checkpointsData = checkpoints.map((checkpoint) => toCheckpoint(checkpoint.data()))
        setCheckPoints(checkpointsData)
    }

    const createPath = async (departureDestination: Checkpoint, arrivalDestination: Checkpoint, timeDeparture: string, distance: number, duration: number) => {
        const created = await pathsCollection.add({ userId: auth.user?.uid, userLastname: auth.userInfo?.lastname, userFirstname: auth.userInfo?.firstname, departureDestination, arrivalDestination, timeDeparture, pickedBy: { userId: null, userLastname: null, userFirstname: null }, distance, duration })
        console.log("CREATE PATH => ", created)
    }

    const getPaths = async () => {
        const paths = (await pathsCollection.where("pickedBy", "==", { userId: null, userLastname: null, userFirstname: null }).get()).docs
        console.log(paths)
        const pathsData = paths.map((path) => toPath(path.data(), path.id))
        setPaths(pathsData)
    }

    const pickPath = async (path: Path) => {

    }

    return (
        <FirestoreContext.Provider
            value={{
                checkPoints,
                createPath,
                paths
            }}>
            {children}
        </FirestoreContext.Provider>
    )
}


export const useFirestore = () => {
    const firestore = useContext(FirestoreContext)
    return firestore
}