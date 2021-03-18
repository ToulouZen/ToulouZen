export type RootStackParamsList = {
    UserType: undefined,
    Login: {
        userType: string
    },
    Signup: {
        userType: string
    },
    App: undefined
}

export type User = {
    firstname: string,
    lastname: string,
    age: number,
    mail: string,
}