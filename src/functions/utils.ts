import { Checkpoint } from './../types/types';
export const toCheckpoint = (data: any) => {
    const checkpoint: Checkpoint = {
        latitude: data.latitude,
        longitude: data.longitude,
        name: data.name
    }
    return checkpoint
}