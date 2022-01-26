import { MMKVStorage } from 'common/storage';
import { Checkpoint, Path } from 'common/types/types';
import { TOULOUZEN_AGE } from 'constants/Constants';
import I18n from 'internationalization';
import { Alert } from 'react-native';

export const toCheckpoint = (data: any) => {
  const checkpoint: Checkpoint = {
    latitude: data.latitude,
    longitude: data.longitude,
    name: data.name,
  };
  return checkpoint;
};

export const toPath = (data: any, id: any) => {
  const path: Path = {
    id: id,
    userId: data.userId,
    userFirstname: data.userFirstname,
    userLastname: data.userLastname,
    arrivalDestination: data.arrivalDestination,
    departureDestination: data.departureDestination,
    dateDeparture: data.dateDeparture,
    timeDeparture: data.timeDeparture,
    pickedBy: {
      userId: data.pickedBy.userId,
      userLastname: data.pickedBy.userLastname,
      userFirstname: data.pickedBy.userFirstname,
    },
    distance: data.distance,
    duration: data.duration,
    state: data.state,
    startAt: data.startAt,
    endAt: data.endAt,
  };
  return path;
};

export const handleAuthErrors = (e: any) => {
  if (e.code === 'auth/user-not-found') {
    Alert.alert(
      I18n.t('auth.user_not_found.title'),
      I18n.t('auth.user_not_found.description'),
    );
  }
  if (e.code === 'auth/wrong-password') {
    Alert.alert(
      I18n.t('auth.wrong_password.title'),
      I18n.t('auth.wrong_password.description'),
    );
  }
  if (e.code === 'auth/email-already-in-use') {
    Alert.alert(
      I18n.t('auth.email_already_in_use.title'),
      I18n.t('auth.email_already_in_use.description'),
    );
  }
  if (e.code === 'auth/invalid-email') {
    Alert.alert(
      I18n.t('auth.invalid_email.title'),
      I18n.t('auth.invalid_email.description'),
    );
  }
  if (e.code === 'auth/weak-password') {
    Alert.alert(
      I18n.t('auth.weak_password.title'),
      I18n.t('auth.weak_password.description'),
    );
  }
  console.error('An error has occured during authentication : ', e);
};

export function logCurrentStorage() {
  let storage: any = {};
  const keys = MMKVStorage.getAllKeys();
  keys.forEach(key => {
    if (key === TOULOUZEN_AGE) {
      storage[key] = MMKVStorage.getNumber(key);
      return;
    }
    storage[key] = MMKVStorage.getString(key);
  });

  console.log('CURRENT STORAGE: ', storage);
}
