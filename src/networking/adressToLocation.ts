import { Checkpoint } from 'common/types/types';
import GeoJSON, { Point } from 'geojson';

type AddressToLocationParams = {
  address: string;
};

export const getCheckPointFromAddress = async ({
  address,
}: AddressToLocationParams): Promise<Checkpoint | null> => {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${address}&type=housenumber&limit=1`,
    );
    const json = await response.json();
    const coordinates: number[] = json.features[0].geometry.coordinates;
    return {
      name: address,
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
  } catch (error) {
    console.error('Error while fetching coordinates from an address : ', error);
    return null;
  }
};

export const autoCompleteAddress = async ({
  address,
}: AddressToLocationParams) => {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${address}&type=housenumber&limit=5&autocomplete=1`,
    );
    const json: GeoJSON.FeatureCollection<Point> = await response.json();
    return json;
  } catch (error) {
    console.error('Error while fetching coordinates from an address : ', error);
    return null;
  }
};
