"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  destLatitude?: number | null | undefined;
  destLongitude?: number | null | undefined;
  zoom?: number;
}

export default function DriverLocationMap({ latitude, longitude, destLatitude, destLongitude, zoom = 15 }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const [routeInfo, setRouteInfo] = React.useState<{ distance?: number; duration?: number } | null>(null);
  const scriptsLoadedRef = useRef<{ leaflet: boolean; routing: boolean }>({ leaflet: false, routing: false });

  // Load Leaflet and Leaflet Routing Machine
  useEffect(() => {
    const loadLeaflet = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-leaflet', '1');
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.setAttribute('data-leaflet', '1');
          script.onload = () => {
            scriptsLoadedRef.current.leaflet = true;
            console.log('✅ Leaflet loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load Leaflet'));
          document.body.appendChild(script);
        });
      } else {
        scriptsLoadedRef.current.leaflet = true;
      }

      // Load Leaflet Routing Machine CSS
      if (!document.querySelector('link[data-lrm]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-lrm', '1');
        link.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
        document.head.appendChild(link);
      }

      // Load Leaflet Routing Machine JS
      if (!(window as any).L?.Routing) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js';
          script.async = true;
          script.setAttribute('data-lrm', '1');
          script.onload = () => {
            scriptsLoadedRef.current.routing = true;
            console.log('✅ Leaflet Routing Machine loaded');
            resolve();
          };
          script.onerror = () => {
            console.error('⚠️ Failed to load Leaflet Routing Machine');
            resolve(); // Don't fail, routing is optional
          };
          document.body.appendChild(script);
        });
      } else {
        scriptsLoadedRef.current.routing = true;
      }
    };

    loadLeaflet().catch((err) => {
      console.error('❌ Error loading Leaflet:', err);
    });
  }, []);

  // Initialize map and update markers
  useEffect(() => {
    if (!scriptsLoadedRef.current.leaflet) {
      console.warn('⏳ Leaflet not yet loaded');
      return;
    }

    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Create map if it doesn't exist
    if (!leafletMapRef.current) {
      console.log('🗺️ Creating map...');
      leafletMapRef.current = L.map(mapRef.current, {
        center: [latitude || 20, longitude || 0],
        zoom: latitude && longitude ? zoom : 2,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(leafletMapRef.current);
    }

    // Always update/create driver marker with custom icon
    if (latitude != null && longitude != null) {
      const driverHtml = `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#1976d2;color:white;font-weight:700;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:20px;">🚑</div>`;
      const driverIcon = L.divIcon({ html: driverHtml, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([latitude, longitude]);
        console.log('🚑 Driver marker updated at:', { latitude, longitude });
      } else {
        driverMarkerRef.current = L.marker([latitude, longitude], { icon: driverIcon }).addTo(leafletMapRef.current);
        console.log('🚑 Driver marker created at:', { latitude, longitude });
      }

      leafletMapRef.current.setView([latitude, longitude], zoom);
    }

    // Always update/create destination marker with custom icon
    if (destLatitude != null && destLongitude != null) {
      const userHtml = `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#d32f2f;color:white;font-weight:700;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:20px;">👤</div>`;
      const userIcon = L.divIcon({ html: userHtml, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });

      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng([destLatitude, destLongitude]);
        console.log('👤 User marker updated at:', { destLatitude, destLongitude });
      } else {
        destMarkerRef.current = L.marker([destLatitude, destLongitude], { icon: userIcon }).addTo(leafletMapRef.current);
        console.log('👤 User marker created at:', { destLatitude, destLongitude });
      }
    }

    // Fit bounds to show both markers if both exist
    if (driverMarkerRef.current && destMarkerRef.current) {
      try {
        const group = L.featureGroup([driverMarkerRef.current, destMarkerRef.current]);
        leafletMapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        console.log('📦 Fitted bounds to show both markers');
      } catch (e) {
        console.warn('Could not fit bounds:', e);
      }
    }

    return () => {
      // Don't remove map on cleanup to prevent re-initialization
    };
  }, [latitude, longitude, destLatitude, destLongitude, zoom]);

  // Create routing when both coordinates are available
  useEffect(() => {
    if (!scriptsLoadedRef.current.leaflet || !scriptsLoadedRef.current.routing) {
      console.warn('⏳ Scripts not ready for routing. Leaflet:', scriptsLoadedRef.current.leaflet, 'Routing:', scriptsLoadedRef.current.routing);
      return;
    }

    const L = (window as any).L;
    if (!L || !leafletMapRef.current) return;
    if (!(window as any).L?.Routing) {
      console.warn('⚠️ Leaflet Routing Machine not available');
      return;
    }

    console.log('🗺️ Setting up route with coords:', { latitude, longitude, destLatitude, destLongitude });

    // Clean up existing routing control
    try {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
    } catch (e) {
      console.error('Error removing old routing:', e);
    }

    // Only create routing when both driver coords and destination are available
    if (latitude != null && longitude != null && destLatitude != null && destLongitude != null) {
      try {
        console.log('📍 Creating route with waypoints:', {
          start: [latitude, longitude],
          end: [destLatitude, destLongitude]
        });
        const routing = (window as any).L.Routing.control({
          waypoints: [
            (window as any).L.latLng(latitude, longitude),
            (window as any).L.latLng(destLatitude, destLongitude)
          ],
          show: false,
          addWaypoints: false,
          routeWhileDragging: false,
          fitSelectedRoute: true,
          lineOptions: {
            styles: [
              { color: '#1976d2', opacity: 0.95, weight: 6 },
              { color: '#ffffff', opacity: 0.9, weight: 2 }
            ]
          },
          router: (window as any).L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
        }).addTo(leafletMapRef.current);

        routing.on('routesfound', function(e: any) {
          try {
            const summary = e.routes && e.routes[0] && e.routes[0].summary;
            if (summary) {
              const distance = summary.totalDistance || summary.distance || summary.distance_in_meters || summary.distanceInMeters;
              const duration = summary.totalTime || summary.time || summary.duration;
              console.log('✅ Route found:', { distance, duration });
              setRouteInfo({ distance, duration });
            }
          } catch (er) {
            console.error('❌ Error processing route:', er);
          }
        });

        routing.on('routingerror', function(e: any) {
          console.error('❌ Routing error:', e);
        });

        routingControlRef.current = routing;

        // Fit bounds to show both markers nicely (with some padding)
        try {
          const group = (window as any).L.featureGroup([driverMarkerRef.current, destMarkerRef.current].filter(Boolean));
          if (group && group.getBounds && group.getBounds().isValid()) {
            leafletMapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
            console.log('📦 Fitted bounds to show route');
          }
        } catch (e) {
          console.warn('Could not fit bounds:', e);
        }
      } catch (err) {
        console.error('❌ Failed to create routing control:', err);
      }
    } else {
      console.log('⏸️ Not enough coordinates to create route');
      setRouteInfo(null);
    }
  }, [latitude, longitude, destLatitude, destLongitude]);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: 320, borderRadius: 8, overflow: 'hidden' }} />
        {routeInfo && (
          <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 9999, background: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>ETA: {routeInfo.duration ? Math.round(routeInfo.duration/60) + ' min' : '—'}</div>
            <div style={{ fontSize: 12, color: '#333' }}>Distance: {routeInfo.distance ? (routeInfo.distance/1000).toFixed(2) + ' km' : '—'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
