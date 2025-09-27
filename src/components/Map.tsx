import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Report, Route } from '@/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, Navigation, MapPin } from 'lucide-react';

interface MapProps {
  reports: Report[];
  routes: Route[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedRoute?: string;
}

const Map: React.FC<MapProps> = ({ reports, routes, onLocationSelect, selectedRoute }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Will be replaced with actual key
        version: 'weekly',
        libraries: ['places', 'geometry'],
      });

      try {
        await loader.load();
        
        if (!mapRef.current) return;

        // Initialize map centered on Nairobi
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: -1.2921, lng: 36.8219 }, // Nairobi coordinates
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(pos);
              mapInstance.setCenter(pos);

              // Add user location marker
              new google.maps.Marker({
                position: pos,
                map: mapInstance,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                },
                title: 'Your Location',
              });
            },
            () => {
              console.error('Geolocation permission denied');
            }
          );
        }

        // Handle map clicks
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (onLocationSelect && e.latLng) {
            onLocationSelect(e.latLng.lat(), e.latLng.lng());
          }
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [onLocationSelect]);

  // Update markers when reports change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add report markers
    reports.forEach((report) => {
      const marker = new google.maps.Marker({
        position: { lat: report.location.lat, lng: report.location.lng },
        map,
        icon: {
          url: getMarkerIcon(report.type),
          scaledSize: new google.maps.Size(30, 30),
        },
        title: report.description,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${report.route}</h3>
            <p class="text-sm">${report.description}</p>
            <p class="text-xs text-gray-500">${new Date(report.timestamp).toLocaleString()}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [map, reports]);

  // Draw routes on map
  useEffect(() => {
    if (!map || !selectedRoute) return;

    const route = routes.find((r) => r.id === selectedRoute);
    if (!route) return;

    const routePath = new google.maps.Polyline({
      path: route.coordinates,
      geodesic: true,
      strokeColor: getTrafficColor(route.trafficStatus),
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    routePath.setMap(map);

    // Fit map to route bounds
    const bounds = new google.maps.LatLngBounds();
    route.coordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);

    return () => {
      routePath.setMap(null);
    };
  }, [map, selectedRoute, routes]);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMi4wMSIgeTI9IjE2Ii8+PC9zdmc+';
      case 'fare':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmJjMDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48bGluZSB4MT0iMTIiIHkxPSIxIiB4Mj0iMTIiIHkyPSIyMyIvPjxwYXRoIGQ9Ik0xNyA1SDkuNWEzLjUgMy41IDAgMCAwIDAgN2gzYTMuNSAzLjUgMCAwIDEgMCA3SDYiLz48L3N2Zz4=';
      case 'availability':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNGE4NTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIxIiB5PSIzIiB3aWR0aD0iMjIiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIvPjxsaW5lIHgxPSI5IiB5MT0iMjEiIHgyPSI5IiB5Mj0iMyIvPjxsaW5lIHgxPSIxNSIgeTE9IjIxIiB4Mj0iMTUiIHkyPSIzIi8+PC9zdmc+';
      default:
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCAzLjMxNC02IDEyLTkgMTJzLTktOC42ODYtOS0xMmE5IDkgMCAwIDEgMTggMHoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIi8+PC9zdmc+';
    }
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#34a853';
      case 'moderate':
        return '#fbbc04';
      case 'high':
        return '#ea4335';
      case 'severe':
        return '#991b1b';
      default:
        return '#6b7280';
    }
  };

  const centerOnUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(15);
    }
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden shadow-xl">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="default"
          size="icon"
          onClick={centerOnUserLocation}
          className="shadow-lg"
          disabled={!userLocation}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 z-10 p-3 bg-card/95 backdrop-blur-sm">
        <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="h-3 w-3 text-destructive" />
            <span>Traffic Report</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-warning" />
            <span>Fare Change</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-success" />
            <span>Matatu Available</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Map;