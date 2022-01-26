import { Checkpoint, Location } from 'common/types/types';
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type LocationContextType = {
  userLocation: Location;
  departureCheckPoint: Checkpoint;
  arrivalCheckPoint: Checkpoint;
  updateUserLocation: Dispatch<SetStateAction<Location>>;
  setDepartureCheckPoint: Dispatch<SetStateAction<Checkpoint>>;
  setArrivalCheckPoint: Dispatch<SetStateAction<Checkpoint>>;
};

export const defaultAppLocation = {
  longitude: 1.444209,
  latitude: 43.604652,
};

const defaultLocationState: LocationContextType = {
  userLocation: defaultAppLocation,
  departureCheckPoint: {
    name: 'Ma position',
    ...defaultAppLocation,
  },
  arrivalCheckPoint: {
    name: '',
    ...defaultAppLocation,
  },
  updateUserLocation: () => {},
  setDepartureCheckPoint: () => {},
  setArrivalCheckPoint: () => {},
};

const LocationContext =
  createContext<LocationContextType>(defaultLocationState);

export const LocationContextProvider: FC = ({ children }) => {
  const [userLocation, updateUserLocation] =
    useState<Location>(defaultAppLocation);
  const [departureCheckPoint, setDepartureCheckPoint] = useState<Checkpoint>({
    ...defaultAppLocation,
    name: 'Ma position',
  });

  const [arrivalCheckPoint, setArrivalCheckPoint] = useState<Checkpoint>({
    name: '',
    ...defaultAppLocation,
  });

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        departureCheckPoint,
        arrivalCheckPoint,
        updateUserLocation,
        setDepartureCheckPoint,
        setArrivalCheckPoint,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  return useContext(LocationContext);
};
