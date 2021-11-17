import { Checkpoint, Path } from 'common/types/types';

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
