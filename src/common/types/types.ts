export type RootStackParamsList = {
  UserType: undefined;
  Login: undefined;
  Signup: {
    userType: string;
  };
  PasswordReset: undefined;
  AuthApp: undefined;
  LoggedApp: undefined;
  Home: undefined;
  Paths: undefined;
  Settings: undefined;
  DriverConfirm: undefined;
};

export type User = {
  firstname: string;
  lastname: string;
  age: number;
  mail: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type Checkpoint = Location & {
  name: string;
};

export type Path = {
  id: string;
  userId: string;
  userLastname: string;
  userFirstname: string;
  arrivalDestination: Checkpoint;
  departureDestination: Checkpoint;
  dateDeparture: string;
  timeDeparture: string;
  pickedBy: {
    userId: string;
    userLastname: string;
    userFirstname: string;
  };
  distance: number;
  duration: number;
  state: string;
  startAt: string;
  endAt: string;
};

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};
