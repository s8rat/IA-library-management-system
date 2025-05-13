import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface MapViewProps {
  locations?: { id: number; lat: number; lng: number; name?: string }[];
  onMarkerClick?: (id: number) => void;
  selectedLocationId?: number | null;
}

const MapView: React.FC<MapViewProps> = ({
  locations = [],
  onMarkerClick,
  selectedLocationId,
}) => {
  const defaultPosition: LatLngExpression = [51.505, -0.09];

  return (
    <div className="w-full h-[70vh] rounded-lg shadow border">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations
          .filter(
            (loc) =>
              loc &&
              typeof loc.lat === "number" &&
              typeof loc.lng === "number" &&
              !isNaN(loc.lat) &&
              !isNaN(loc.lng)
          )
          .map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(loc.id),
              }}
            >
              <Popup>
                {loc.name || `Location ${loc.id}`}
                {selectedLocationId === loc.id && (
                  <div className="text-blue-600 font-bold">[Selected]</div>
                )}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
