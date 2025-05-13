import { useState } from "react";

export interface Location {
  id: number;
  lat: number;
  lng: number;
  name?: string;
}
export default function useAddLocations(initial: Location[] = []) {
  const [locations, setLocations] = useState<Location[]>(initial);

  const addLocation = (loc: Omit<Location, "id">) => {
    setLocations((prev) => [
      ...prev,
      { ...loc, id: Date.now() }, // unique id
    ]);
  };

  const removeLocation = (id: number) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  return { locations, addLocation, removeLocation, setLocations };
}
