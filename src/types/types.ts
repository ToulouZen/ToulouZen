export type RootStackParamsList = {
    UserType: undefined,
    Login: {
        userType: string
    },
    Signup: {
        userType: string
    },
    App: undefined,
    Home: undefined
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