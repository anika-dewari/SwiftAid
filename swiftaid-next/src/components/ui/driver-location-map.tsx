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
  const markerRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const [routeInfo, setRouteInfo] = React.useState<{ distance?: number; duration?: number } | null>(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-leaflet', '1');
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).L) return resolve();
        const existing = document.querySelector('script[data-leaflet]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject());
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.setAttribute('data-leaflet', '1');
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };

    let cancelled = false;

    loadScript().then(() => {
      if (cancelled) return;
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      // Initialize map only once
      if (!leafletMapRef.current) {
        leafletMapRef.current = L.map(mapRef.current, {
          center: [latitude || 0, longitude || 0],
          zoom: latitude && longitude ? zoom : 2,
          zoomControl: true,
          attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(leafletMapRef.current);

        // Create markers if coords available
        if (latitude != null && longitude != null) {
          driverMarkerRef.current = L.marker([latitude, longitude]).addTo(leafletMapRef.current);
          leafletMapRef.current.setView([latitude, longitude], zoom);
        }
        if (destLatitude != null && destLongitude != null) {
          destMarkerRef.current = L.marker([destLatitude, destLongitude]).addTo(leafletMapRef.current);
        }

        // Load routing script CSS/JS for route drawing
        const rcss = document.querySelector('link[data-lrm]') as HTMLLinkElement | null;
        if (!rcss) {
          const link2 = document.createElement('link');
          link2.rel = 'stylesheet';
          link2.setAttribute('data-lrm', '1');
          link2.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
          document.head.appendChild(link2);
        }

        if (!(window as any).L.Routing) {
          const scriptLrm = document.createElement('script');
          scriptLrm.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js';
          scriptLrm.async = true;
          scriptLrm.onload = () => {};
          document.body.appendChild(scriptLrm);
        }
      }
    }).catch((err) => {
      console.error('Failed to load Leaflet:', err);
    });

    return () => {
      cancelled = true;
      try {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    const Routing = (window as any).L?.Routing;
    if (!L) return;
    if (!leafletMapRef.current && mapRef.current) {
      // edge-case: create map if script loaded after first render
      leafletMapRef.current = L.map(mapRef.current, {
        center: [latitude || 0, longitude || 0],
        zoom: latitude && longitude ? zoom : 2,
        zoomControl: true,
        attributionControl: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMapRef.current);
    }

    // Update or create driver marker
    if (latitude != null && longitude != null && leafletMapRef.current) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([latitude, longitude]);
      } else {
        // create a distinct driver div icon
        const driverHtml = `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:18px;background:#1976d2;color:white;font-weight:700;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">🚑</div>`;
        const driverIcon = (window as any).L.divIcon({ html: driverHtml, className: '' });
        driverMarkerRef.current = (window as any).L.marker([latitude, longitude], { icon: driverIcon }).addTo(leafletMapRef.current);
      }
      leafletMapRef.current.setView([latitude, longitude], zoom);
    }

    // Update or create destination/user marker
    if (destLatitude != null && destLongitude != null && leafletMapRef.current) {
      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng([destLatitude, destLongitude]);
      } else {
        const userHtml = `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:18px;background:#d32f2f;color:white;font-weight:700;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">👤</div>`;
        const userIcon = (window as any).L.divIcon({ html: userHtml, className: '' });
        destMarkerRef.current = (window as any).L.marker([destLatitude, destLongitude], { icon: userIcon }).addTo(leafletMapRef.current);
      }
    }

    // If routing plugin is available and destination props are provided, draw route
    if ((window as any).L && (window as any).L.Routing && routingControlRef !== null) {
      try {
        const LRM = (window as any).L.Routing;
        // If a routing control already exists, update waypoints
        if (routingControlRef.current) {
          const wp = routingControlRef.current.getWaypoints();
          if (latitude != null && longitude != null) wp[0].latLng = L.latLng(latitude, longitude);
          if (destLatitude != null && destLongitude != null) {
            if (!wp[1]) wp[1] = { latLng: L.latLng(destLatitude, destLongitude) };
            else wp[1].latLng = L.latLng(destLatitude, destLongitude);
          }
          routingControlRef.current.setWaypoints(wp.map((w: any) => w.latLng));
        }
      } catch (e) {
        // ignore
      }
    }
  }, [latitude, longitude, zoom]);

  // effect to (re)create routing control when destination changes
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMapRef.current) return;
    if (!(window as any).L.Routing) return;

    // Clean up existing routing control
    try {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
    } catch (e) {}

    // Only create routing when both driver coords and destination are available
    if (latitude != null && longitude != null && destLatitude != null && destLongitude != null) {
      try {
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
              { color: '#1976d2', opacity: 0.95, weight: 8 },
              { color: '#ffffff', opacity: 0.9, weight: 3 }
            ]
          },
          router: (window as any).L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
        }).addTo(leafletMapRef.current);

        routing.on('routesfound', function(e: any) {
          try {
            const summary = e.routes && e.routes[0] && e.routes[0].summary;
            if (summary) {
              setRouteInfo({ distance: summary.totalDistance || summary.distance || summary.distance_in_meters || summary.distanceInMeters, duration: summary.totalTime || summary.time || summary.duration });
            }
          } catch (er) {}
        });

        routingControlRef.current = routing;
        // Fit bounds to show both markers nicely (with some padding)
        try {
          const group = (window as any).L.featureGroup([ (driverMarkerRef.current || null), (destMarkerRef.current || null) ].filter(Boolean));
          if (group && group.getBounds && group.getBounds().isValid && group.getBounds().isValid()) {
            leafletMapRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
          } else if (group && group.getBounds) {
            // fallback if isValid not provided
            leafletMapRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
          }
        } catch (e) {}
      } catch (err) {
        console.warn('Failed to create routing control:', err);
      }
    } else {
      // nothing to draw
      setRouteInfo(null);
    }
    // cleanup will remove in next effect run via try/catch above
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
