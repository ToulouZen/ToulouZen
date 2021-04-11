import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Checkpoint, Path, User } from '../types/types'
import { toCheckpoint, toPath } from '../functions/utils'
import { useAuth } from './AuthContext'
import moment from 'moment'

type FirestoreContextType = {
    checkPoints: Checkpoint[],
    createPath: (departureDestination: Checkpoint, arrivalDestination: Checkpoint, timeDeparture: string, distance: number, duration: number) => void
    paths: Path[],
    pickPath: (path: Path) => void,
    actualPath: Path | undefined,
    passengerPaths: Path[]
}

const defaultFirestoreState: FirestoreContextType = {
    checkPoints: [],
    createPath: async () => undefined,
    paths: [],
    pickPath: async () => undefined,
    actualPath: undefined,
    passengerPaths: []
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {

    const [checkPoints, setCheckPoints] = useState<Checkpoint[]>([])
    const [paths, setPaths] = useState<Path[]>([])
    const [passengerPaths, setPassengerPaths] = useState<Path[]>([])
    const [actualPathId, setActualPathId] = useState<string>()
    const [actualPath, setActualPath] = useState<Path>()
    const auth = useAuth()

    useEffect(() => {
        getAllCheckpoints()
    }, [])

    useEffect(() => {
        if (auth.userInfo?.userType == "passenger") {
            getPassengerPaths()
        } else {
            getPaths()
        }
    }, [auth.userInfo?.userType])

    useEffect(() => {
        if (actualPathId != undefined) {
            getActualPathInfo()
        }
    }, [actualPathId])

    const checkpointsCollection = firestore().collection('checkpoints')
    const pathsCollection = firestore().collection('paths')

    // Récupération des checkpoints (points d'intêret fréquentés par la population toulousaine)
    const getAllCheckpoints = async () => {
        const checkpoints = (await checkpointsCollection.get()).docs
        const checkpointsData = checkpoints.map((checkpoint) => toCheckpoint(checkpoint.data()))
        setCheckPoints(checkpointsData)
    }

    // Création d'un trajet par une passagère ToulouZen
    const createPath = async (departureDestination: Checkpoint, arrivalDestination: Checkpoint, time: string, distance: number, duration: number) => {
        const dateDeparture = moment(new Date()).format("YYYY-MM-DD")
        const timeDeparture = moment(new Date(dateDeparture + "T" + time + ":00")).format("YYYY-MM-DD HH:mm:ss")
        const result = await pathsCollection.add({ userId: auth.user?.uid, userLastname: auth.userInfo?.lastname, userFirstname: auth.userInfo?.firstname, departureDestination, arrivalDestination, dateDeparture, timeDeparture, pickedBy: { userId: null, userLastname: null, userFirstname: null }, distance, duration })
        // Récupération de l'identifiant du trajet afin d'utiliser la fonction getActualPathInfo
        setActualPathId(result.id)
    }

    // Récupération des données du dernier trajet programmé par une passagère ToulouZen
    const getActualPathInfo = async () => {
        // Un subscriber est utilisé pour mettre à jour les données automatiquement
        const subscriber = pathsCollection.doc(actualPathId).onSnapshot(querySnapshot => {
            setActualPath(toPath(querySnapshot.data(), actualPathId))
        })

        return () => subscriber()
    }

    // Récupération des trajets du jour disponible pour une conductrice ToulouZen
    const getPaths = async () => {
        // Date du jour
        const date = moment(new Date()).format("YYYY-MM-DD")
        // Un subscriber est utilisé pour mettre à jour les données automatiquement
        const subscriber = pathsCollection.where("pickedBy", "==", { userId: null, userLastname: null, userFirstname: null }).where("dateDeparture", "==", date).onSnapshot(querySnapshot => {
            const pathsData = querySnapshot.docs.map((path) => toPath(path.data(), path.id))
            setPaths(pathsData)
        })
        return () => subscriber()
    }

    const getPassengerPaths = async () => {
        // Date du jour
        // Un subscriber est utilisé pour mettre à jour les données automatiquement
        const subscriber = pathsCollection.where("userId", "==", auth.user?.uid).onSnapshot(querySnapshot => {
            const pathsData = querySnapshot.docs.map((path) => toPath(path.data(), path.id))
            setPassengerPaths(pathsData.sort((pathA, pathB) => {
                const timeA = new Date(moment(pathA.timeDeparture).format()).getTime()
                const timeB = new Date(moment(pathB.timeDeparture).format()).getTime()
                return moment(timeB).diff(moment(timeA))
            }))
        })
        return () => subscriber()
    }

    const pickPath = async (path: Path) => {
        await pathsCollection.doc(path.id).update({
            pickedBy: {
                userId: auth.user?.uid,
                userLastname: auth.userInfo?.lastname,
                userFirstname: auth.userInfo?.firstname
            }
        })
    }

    return (
        <FirestoreContext.Provider
            value={{
                checkPoints,
                createPath,
                paths,
                pickPath,
                actualPath,
                passengerPaths
            }}>
            {children}
        </FirestoreContext.Provider>
    )
}


export const useFirestore = () => {
    const firestore = useContext(FirestoreContext)
    return firestore
}