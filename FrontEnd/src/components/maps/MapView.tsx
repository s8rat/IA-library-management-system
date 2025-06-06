import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import { OSM } from "ol/source";
import { Tile as TileLayer } from "ol/layer";
import { Icon, Style } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";

interface Location {
  id: number;
  lat: number;
  lng: number;
  name?: string;
}

interface MapViewProps {
  locations?: Location[];
  onMarkerClick?: (id: number) => void;
  selectedLocationId?: number | null;
  onMapReady?: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  locations = [],
  onMarkerClick,
  selectedLocationId,
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const currentLocationSourceRef = useRef<VectorSource | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      // Source for library locations
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      // Source for current location
      const currentLocationSource = new VectorSource();
      const currentLocationLayer = new VectorLayer({
        source: currentLocationSource,
      });

      map.addLayer(vectorLayer);
      map.addLayer(currentLocationLayer);
      
      mapInstanceRef.current = map;
      vectorSourceRef.current = vectorSource;
      currentLocationSourceRef.current = currentLocationSource;

      // Add click handler for markers
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        if (feature) {
          const locationId = feature.get('id');
          if (locationId) { // Only trigger for library locations, not current location
            onMarkerClick?.(locationId);
          }
        }
      });

      onMapReady?.();

      return () => {
        map.setTarget(undefined);
        mapInstanceRef.current = null;
        vectorSourceRef.current = null;
        currentLocationSourceRef.current = null;
      };
    }
  }, [onMapReady, onMarkerClick]);

  // Request and handle current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  // Update current location marker
  useEffect(() => {
    const currentLocationSource = currentLocationSourceRef.current;
    if (!currentLocationSource || !currentLocation) return;

    currentLocationSource.clear();

    const feature = new Feature({
      geometry: new Point(fromLonLat([currentLocation.lng, currentLocation.lat])),
    });

    feature.setStyle(
      new Style({
        image: new Icon({
          src: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue dot for current location
          scale: 1.5,
          anchor: [0.5, 0.5],
        }),
      })
    );

    currentLocationSource.addFeature(feature);

    // Always center map on current location when it's available
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getView().animate({
        center: fromLonLat([currentLocation.lng, currentLocation.lat]),
        zoom: 13,
        duration: 1000,
      });
    }
  }, [currentLocation]);

  // Update library location markers
  useEffect(() => {
    const vectorSource = vectorSourceRef.current;
    if (!vectorSource) return;

    vectorSource.clear();

    locations.forEach((location) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.lng, location.lat])),
      });

      feature.set('id', location.id);

      const isSelected = location.id === selectedLocationId;
      feature.setStyle(
        new Style({
          image: new Icon({
            src: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            scale: isSelected ? 2 : 1.5,
            anchor: [0.5, 1],
          }),
        })
      );

      vectorSource.addFeature(feature);
    });

    // Only center on first location if there's no current location
    if (locations.length > 0 && !currentLocation) {
      const firstLocation = locations[0];
      mapInstanceRef.current?.getView().animate({
        center: fromLonLat([firstLocation.lng, firstLocation.lat]),
        zoom: 13,
        duration: 1000,
      });
    }
  }, [locations, selectedLocationId, currentLocation]);

  return (
    <div className="w-full h-[70vh] rounded-xl shadow-md border overflow-hidden" ref={mapRef}></div>
  );
};

export default MapView;
