"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  zoom?: number;
}

export default function DriverLocationMap({ latitude, longitude, zoom = 15 }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

        // Create marker if coords available
        if (latitude && longitude) {
          markerRef.current = L.marker([latitude, longitude]).addTo(leafletMapRef.current);
          leafletMapRef.current.setView([latitude, longitude], zoom);
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

    if (latitude && longitude && leafletMapRef.current) {
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = (window as any).L.marker([latitude, longitude]).addTo(leafletMapRef.current);
      }
      leafletMapRef.current.setView([latitude, longitude], zoom);
    }
  }, [latitude, longitude, zoom]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 280, borderRadius: 8, overflow: 'hidden' }} />
    </div>
  );
}
