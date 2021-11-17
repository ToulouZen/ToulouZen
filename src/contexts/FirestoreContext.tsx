import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Checkpoint, Path } from 'common/types/types';
import { toCheckpoint, toPath } from 'utils/utils';
import { useAuth } from './AuthContext';

type FirestoreContextType = {
  checkPoints: Checkpoint[];
  createPath: (
    departureDestination: Checkpoint,
    arrivalDestination: Checkpoint,
    timeDeparture: string,
    distance: number,
    duration: number,
  ) => void;
  paths: Path[];
  pickPath: (path: Path) => void;
  actualPath: Path | undefined;
  passengerPaths: Path[];
  deletePath: (pathId: string) => void;
  driverPaths: Path[];
  endPath: () => void;
  resetActualPathId: () => void;
  getPassengerPaths: () => void;
  getDriverPaths: () => void;
  getPaths: () => void;
  getAllCheckpoints: () => void;
  resetAll: () => void;
};

const defaultFirestoreState: FirestoreContextType = {
  checkPoints: [],
  createPath: async () => undefined,
  paths: [],
  pickPath: async () => undefined,
  actualPath: undefined,
  passengerPaths: [],
  deletePath: async () => undefined,
  driverPaths: [],
  endPath: async () => undefined,
  resetActualPathId: () => undefined,
  getPassengerPaths: () => undefined,
  getDriverPaths: () => undefined,
  getPaths: () => undefined,
  getAllCheckpoints: () => undefined,
  resetAll: () => undefined,
};

const FirestoreContext = createContext<FirestoreContextType>(
  defaultFirestoreState,
);

export const FirestoreContextProvider: React.FC = ({ children }) => {
  const [checkPoints, setCheckPoints] = useState<Checkpoint[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [passengerPaths, setPassengerPaths] = useState<Path[]>([]);
  const [driverPaths, setDriverPaths] = useState<Path[]>([]);
  const [actualPathId, setActualPathId] = useState<string>();
  const [actualPath, setActualPath] = useState<Path>();
  const auth = useAuth();

  useEffect(() => {
    console.log('checkpoints => ', checkPoints);
    console.log('paths =>', paths);
    console.log('driverPaths => ', driverPaths);
    console.log('passengerPaths => ', passengerPaths);
    console.log('actualPathId =>', actualPathId);
    console.log('actualPath =>', actualPath);
  });

  useEffect(() => {
    if (
      auth.userInfo != undefined &&
      auth.userInfo.userType != undefined &&
      actualPathId != undefined
    ) {
      getActualPathInfo();
    }
  }, [actualPathId]);

  const checkpointsCollection = firestore().collection('checkpoints');
  const pathsCollection = firestore().collection('paths');

  const resetActualPathId = () => {
    setActualPathId(undefined);
    setActualPath(undefined);
  };

  const resetAll = () => {
    getActualPathInfoUnsub();
    getPathsUnsub();
    getDriverPathsUnsub();
    getPassengerPathsUnsub();
    setCheckPoints([]);
    setPaths([]);
    setDriverPaths([]);
    setPassengerPaths([]);
    resetActualPathId();
  };

  // Récupération des checkpoints (points d'intêret fréquentés par la population toulousaine)
  const getAllCheckpoints = async () => {
    const checkpoints = (await checkpointsCollection.get()).docs;
    const checkpointsData = checkpoints.map(checkpoint =>
      toCheckpoint(checkpoint.data()),
    );
    setCheckPoints(checkpointsData);
  };

  // Création d'un trajet par une passagère ToulouZen
  const createPath = async (
    departureDestination: Checkpoint,
    arrivalDestination: Checkpoint,
    time: string,
    distance: number,
    duration: number,
  ) => {
    let dateDeparture = moment().format('YYYY-MM-DD');
    if (['00:00', '00:30', '01:00', '01:30', '02:00'].includes(time)) {
      dateDeparture = moment().add(1, 'day').format('YYYY-MM-DD');
    }
    let timeDeparture = '';
    if (time == 'Maintenant') {
      timeDeparture = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      timeDeparture = moment(
        new Date(dateDeparture + 'T' + time + ':00'),
      ).format('YYYY-MM-DD HH:mm:ss');
    }

    const result = await pathsCollection.add({
      userId: auth.user?.uid,
      userLastname: auth.userInfo?.lastname,
      userFirstname: auth.userInfo?.firstname,
      departureDestination,
      arrivalDestination,
      dateDeparture,
      timeDeparture,
      pickedBy: { userId: null, userLastname: null, userFirstname: null },
      distance,
      duration,
      state: 'CREATED',
      startAt: null,
      endAt: null,
    });
    // Récupération de l'identifiant du trajet afin d'utiliser la fonction getActualPathInfo
    setActualPathId(result.id);
  };

  const deletePath = async (pathId: string) => {
    await pathsCollection.doc(pathId).delete();
  };

  // Récupération des données du dernier trajet programmé par une passagère ToulouZen
  const getActualPathInfo = async () => {
    // Un subscriber est utilisé pour mettre à jour les données automatiquement
    const subscriber = pathsCollection
      .doc(actualPathId)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.exists) {
          setActualPath(toPath(querySnapshot.data(), actualPathId));
        }
      });

    return () => subscriber();
  };

  const getActualPathInfoUnsub = pathsCollection
    .doc(actualPathId)
    .onSnapshot(querySnapshot => {});

  // Récupération des trajets du jour disponible pour une conductrice ToulouZen
  const getPaths = async () => {
    // Date du jour
    const date = moment().format('YYYY-MM-DD');
    // Un subscriber est utilisé pour mettre à jour les données automatiquement
    const subscriber = pathsCollection
      .where('pickedBy', '==', {
        userId: null,
        userLastname: null,
        userFirstname: null,
      })
      .where('dateDeparture', '==', date)
      .onSnapshot(querySnapshot => {
        const pathsData = querySnapshot.docs.map(path =>
          toPath(path.data(), path.id),
        );
        setPaths(pathsData);
      });
    return () => subscriber();
  };

  const getPathsUnsub = pathsCollection.onSnapshot(querySnapshot => {});

  const getPassengerPaths = async () => {
    // Date du jour
    // Un subscriber est utilisé pour mettre à jour les données automatiquement
    const subscriber = pathsCollection
      .where('userId', '==', auth.user?.uid)
      .onSnapshot(querySnapshot => {
        const pathsData = querySnapshot.docs.map(path =>
          toPath(path.data(), path.id),
        );
        const pathsDataSort = pathsData.sort((pathA, pathB) => {
          return (
            moment(pathB.timeDeparture).unix() -
            moment(pathA.timeDeparture).unix()
          );
        });
        if (pathsDataSort.length != 0) {
          const date = moment().format('YYYY-MM-DD');
          const actualPath = pathsDataSort[0];
          if (actualPath.dateDeparture == date && actualPath.state != 'DONE') {
            setActualPathId(actualPath.id);
          } else {
            setActualPathId(undefined);
            setActualPath(undefined);
          }
        }
        setPassengerPaths(pathsData);
      });
    return () => subscriber();
  };

  const getPassengerPathsUnsub = pathsCollection.onSnapshot(
    querySnapshot => {},
  );

  const getDriverPaths = async () => {
    const subscriber = pathsCollection
      .where('pickedBy', '==', {
        userId: auth.user?.uid,
        userFirstname: auth.userInfo?.firstname,
        userLastname: auth.userInfo?.lastname,
      })
      .onSnapshot(querySnapshot => {
        const pathsData = querySnapshot.docs.map(path =>
          toPath(path.data(), path.id),
        );
        const pathsDataSort = pathsData.sort((pathA, pathB) => {
          return (
            moment(pathB.timeDeparture).unix() -
            moment(pathA.timeDeparture).unix()
          );
        });
        if (pathsDataSort.length != 0) {
          const date = moment().format('YYYY-MM-DD');
          const actualPath = pathsDataSort[0];
          if (actualPath.dateDeparture == date) {
            setActualPathId(actualPath.id);
          }
        }

        setDriverPaths(pathsDataSort);
      });
    return () => subscriber();
  };

  const getDriverPathsUnsub = pathsCollection.onSnapshot(querySnapshot => {});

  const pickPath = async (path: Path) => {
    pathsCollection
      .doc(path.id)
      .update({
        pickedBy: {
          userId: auth.user?.uid,
          userLastname: auth.userInfo?.lastname,
          userFirstname: auth.userInfo?.firstname,
        },
        state: 'STARTED',
        startAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .then(async () => {
        const actualPath = (await pathsCollection.doc(path.id).get()).data();
        setActualPathId(path.id);
        setActualPath(toPath(actualPath, path.id));
      });
  };

  const endPath = async () => {
    pathsCollection
      .doc(actualPath!.id)
      .update({
        state: 'DONE',
        endAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .then(() => {
        resetActualPathId();
      });
  };

  return (
    <FirestoreContext.Provider
      value={{
        checkPoints,
        createPath,
        paths,
        pickPath,
        actualPath,
        passengerPaths,
        deletePath,
        driverPaths,
        endPath,
        resetActualPathId,
        getPassengerPaths,
        getDriverPaths,
        getPaths,
        getAllCheckpoints,
        resetAll,
      }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const firestore = useContext(FirestoreContext);
  return firestore;
};
