import { Location } from 'common/types/types';
import GeoJSON from 'geojson';

type RoutesFromTwoCoordinatesParams = {
  departureLocation: Location;
  arrivalLocation: Location;
  overview?: string;
  annotations?: boolean;
  geometries?: string;
};

type RoutesFromTwoCoordinatesReturnType = {
  geometry: GeoJSON.Geometry;
  weight: number;
  distance: number;
  duration: number;
};

export const getRoutesFromTwoCoordinates = async ({
  departureLocation,
  arrivalLocation,
  overview = 'simplified',
  annotations = false,
  geometries = 'geojson',
}: RoutesFromTwoCoordinatesParams): Promise<RoutesFromTwoCoordinatesReturnType | null> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${departureLocation.longitude},${departureLocation.latitude};${arrivalLocation.longitude},${arrivalLocation.latitude}?overview=${overview}&annotations=${annotations}&geometries=${geometries}`,
    );
    const json = await response.json();
    const route: RoutesFromTwoCoordinatesReturnType = json.routes[0];
    return route;
  } catch (error) {
    console.error('Error while fetching routes directions ', error);
    return null;
  }
};
