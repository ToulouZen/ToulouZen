export type RootStackParamsList = {
    UserType: undefined,
    Login: undefined
    Signup: {
        userType: string
    },
    App: undefined,
    Home: undefined,
    Paths: undefined,
    DriverConfirm: undefined,
    Settings: undefined,
    PasswordReset: undefined
}

export type User = {
    firstname: string,
    lastname: string,
    age: number,
    mail: string,
}

export type Checkpoint = {
    name: string,
    latitude: number,
    longitude: number,
}

export type Path = {
    id: string,
    userId: string,
    userLastname: string,
    userFirstname: string,
    arrivalDestination: Checkpoint,
    departureDestination: Checkpoint,
    dateDeparture: string,
    timeDeparture: string,
    pickedBy: {
        userId: string,
        userLastname: string,
        userFirstname: string
    },
    distance: number,
    duration: number,
    state: string,
    startAt: string,
    endAt: string
}