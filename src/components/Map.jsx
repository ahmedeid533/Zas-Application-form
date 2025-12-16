// Map.jsx
import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

// Leaflet CSS (ضروري)
import "leaflet/dist/leaflet.css";
import { useScreenViewStore } from "../assets/store/screenViewStore";
import { useAddressStore } from "../assets/store/addressStore";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../assets/store/cartStore";

// --- Configuration ---
const RESTAURANT = { lat: 30.094131, lng: 31.365530 };

// Pricing logic
const BASE_FEE = 10;
const PER_KM = 2;
const MIN_FEE = 10;
const MAX_FEE = 100;

// Helpers
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function computeFee(distanceMeters) {
  const km = distanceMeters / 1000;
  const raw = BASE_FEE + PER_KM * km;
  const fee = Math.min(MAX_FEE, Math.max(MIN_FEE, raw));
  return Math.round(fee * 100) / 100;
}

// small divIcons
const restIcon = L.divIcon({
  className: "rest-icon",
  html: `<img src="/images/logo.png" alt="skyculinaire" style="width:90px" />`,
//   iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function DeliveryMap() {
    const {navBarHeight,footerHeight}=useScreenViewStore();
  const [customerPos, setCustomerPos] = useState({
    lat: RESTAURANT.lat + 0.01,
    lng: RESTAURANT.lng + 0.01,
  });
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [durationSec, setDurationSec] = useState(null);
  const [fee, setFee] = useState(null);
  const [status, setStatus] = useState("idle");
  const [addressQuery, setAddressQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
          const {address,setAddress,isAddressMap,setIsAddressMap}=useAddressStore();
          const{setDeliveryFee}=useCartStore();


  // compute route & fee (uses OSRM public router, fallback to haversine)
  async function computeRouteAndFee(destLat, destLng) {
    setStatus("computing");
    try {
      const src = `${RESTAURANT.lng},${RESTAURANT.lat}`;
      const dst = `${destLng},${destLat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${src};${dst}?overview=false&alternatives=false&steps=false`;
      const res = await fetch(url, {
        headers: { "User-Agent": "talabat-demo/1.0" },
      });
      if (!res.ok) throw new Error("OSRM request failed");
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const d = data.routes[0].distance;
        const dur = data.routes[0].duration;
        setDistanceMeters(d);
        setDurationSec(dur);
        setFee(computeFee(d));
        setStatus("ok");
        return;
      }
      // fallback: straight-line
      const d = haversineMeters(RESTAURANT.lat, RESTAURANT.lng, destLat, destLng);
      setDistanceMeters(d);
      setDurationSec(null);
      setFee(computeFee(d));
      setStatus("fallback");
    } catch (err) {
      console.error("Routing error", err);
      const d = haversineMeters(RESTAURANT.lat, RESTAURANT.lng, destLat, destLng);
      setDistanceMeters(d);
      setDurationSec(null);
      setFee(computeFee(d));
      setStatus("error");
    }
  }

  // reverse geocode (Nominatim)
const NOMINATIM_HEADERS = {
  "User-Agent": "SkyCulinary-WebApp/1.0 (+contact@skyculinary.com)",
  "Accept-Language": "en",
  "Referer": window.location.origin
};

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    const r = await fetch(url, { headers: NOMINATIM_HEADERS });
    if (!r.ok) throw new Error("Reverse geocode failed");

    const j = await r.json();
    return j.display_name || null;
  } catch (e) {
    console.warn("reverseGeocode failed", e);
    return null;
  }
}


  // use geolocation to set default customer pos (on mount)
  useEffect(() => {
    let mounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!mounted) return;
          const { latitude: lat, longitude: lng } = pos.coords;
          setCustomerPos({ lat, lng });
          // center map when ready
          if (mapRef.current) {
            try {
              mapRef.current.setView([lat, lng], 15);
              // ensure tiles redraw correctly
              setTimeout(() => mapRef.current.invalidateSize && mapRef.current.invalidateSize(), 200);
            } catch (e) {}
          }
          await computeRouteAndFee(lat, lng);
          const addr = await reverseGeocode(lat, lng);
          setSelectedAddress(addr);
        },
        (err) => {
          // user denied or error -> fallback to RESTAURANT nearby default
          console.warn("Geolocation failed or denied:", err);
          // compute for initial default
          computeRouteAndFee(customerPos.lat, customerPos.lng);
          reverseGeocode(customerPos.lat, customerPos.lng).then(setSelectedAddress).catch(()=>{});
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      // no geolocation -> fallback
      computeRouteAndFee(customerPos.lat, customerPos.lng);
      reverseGeocode(customerPos.lat, customerPos.lng).then(setSelectedAddress).catch(()=>{});
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MapEvents component must be inside DeliveryMap to access state setters & functions
  function MapEvents() {
    const map = useMap();

    useEffect(() => {
      // Save map instance to ref so we can call setView/invalidateSize elsewhere
      if (mapRef) mapRef.current = map;

      // ensure tiles drawn correctly
      setTimeout(() => {
        try { map.invalidateSize(); } catch(e) {}
      }, 200);

      const onMoveEnd = async () => {
        const center = map.getCenter();
        setCustomerPos({ lat: center.lat, lng: center.lng });
        await computeRouteAndFee(center.lat, center.lng);
        const addr = await reverseGeocode(center.lat, center.lng);
        setSelectedAddress(addr);
      };

      map.on("moveend", onMoveEnd);

      return () => {
        map.off("moveend", onMoveEnd);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    return null;
  }

  // address search (geocode)
  async function geocode(q) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
      const r = await fetch(url, { headers: { "User-Agent": "talabat-demo/1.0" } });
      if (!r.ok) throw new Error("Geocode failed");
      const arr = await r.json();
      if (!arr || arr.length === 0) throw new Error("No results");
      const item = arr[0];
      return { lat: parseFloat(item.lat), lng: parseFloat(item.lon), display_name: item.display_name };
    } catch (e) {
      throw e;
    }
  }

  async function onSearch() {
    if (!addressQuery) return;
    setStatus("geocoding");
    try {
      const g = await geocode(addressQuery);
      setSelectedAddress(g.display_name);
      // center map to this point
      if (mapRef.current) {
        mapRef.current.setView([g.lat, g.lng], 16);
      }
      setCustomerPos({ lat: g.lat, lng: g.lng });
      await computeRouteAndFee(g.lat, g.lng);
      setStatus("ok");
    } catch (err) {
      console.error(err);
      alert("Geocoding failed: " + (err.message || err));
      setStatus("error");
    }
  }

  // CSS for the fixed center marker (you can move to your CSS/tailwind file)
  const markerCenterStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -100%)",
    fontSize: "36px",
    zIndex: 999,
    pointerEvents: "none",
  };
  const positionButtonStyle={
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    padding: "10px 20px",
    backgroundColor: "#B88E52",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    fontSize: "16px",
    minWidth: "150px",
  }

  function onConfirm() {
    setAddress(selectedAddress);
    setIsAddressMap(true);
    setDeliveryFee(fee);
    navigate(-1);
  }
  const [mainHeight,setMainHeight]=useState(0)
// const navbar=useRef(document?.querySelector("nav"))
// const footer=useRef(document?.querySelector("footer"))
//   useEffect(() => {
//     console.log("navbar",navbar);
    
//   }, [document.querySelector("nav"),document.querySelector("footer")]);
useEffect(() => {
    setMainHeight(window.innerHeight - (Number(footerHeight)||0) - (Number(navBarHeight)||0))
}, [footerHeight,navBarHeight])

  return (
    <div
      style={{ height: `${mainHeight}px` }}
      className={` bg-amber-400 flex flex-col lg:flex-row `}
    >
      <div className="lg:w-1/3 lg:h-full h-auto w-full p-4 bg-gray-50">
        <h1 className="lg:text-2xl text-lg font-semibold lg:mb-4 mb-1">Delivery Location</h1>

        <div className="lg:mb-4">
          <div className="text-sm text-gray">Selected address</div>
          <div className="font-medium text-sm wrap-break-word">
            {selectedAddress ?? "Move the map to choose location"}
          </div>
        </div>

        <div className="mb-4 hidden lg:block">
          <label className="block text-sm font-medium text-gray">
            Find address
          </label>
          <div className="flex gap-2 mt-2">
            <input
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Type address to geocode"
            />
            <button
              onClick={onSearch}
              className="px-3 py-2 bg-primary text-white rounded cursor-pointer"
            >
              Find
            </button>
          </div>
        </div>

        <div className="mb-2 hidden lg:block">
          <div className="text-sm text-gray">Customer (center)</div>
          <div className="text-sm">
            Lat: {customerPos.lat.toFixed(6)} | Lng:{" "}
            {customerPos.lng.toFixed(6)}
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded shadow-sm items-start justify-between  flex lg:block">
          <div className="">
            <div className="text-sm text-gray">Distance</div>
            <div className="text-lg font-medium">
              {distanceMeters
                ? (distanceMeters / 1000).toFixed(2) + " km"
                : "—"}
            </div>
          </div>
          <div className="">
            <div className="text-sm text-gray lg:mt-3">Duration</div>
            <div className="text-lg font-medium">
              {durationSec ? Math.round(durationSec / 60) + " min" : "—"}
            </div>
          </div>
          <div className="">
            <div className="text-sm text-gray lg:mt-3">Delivery Fee</div>
            <div className="lg:text-2xl text-lg font-bold text-primary">
              {fee != null ? fee + " (EGP)" : "—"}
            </div>
          </div>

          <div className="text-xs text-gray-500 lg:mt-3">Mode: {status}</div>
        </div>

        {/* <div className="mt-6 text-sm text-gray-500">
          <p>
          This demo calls <strong>router.project-osrm.org</strong> and <strong>nominatim.openstreetmap.org</strong>.
            For production use a paid provider or host your own router/geocoder.
            </p>
        </div> */}
      </div>

      <div className="flex-1 relative left-0 w-full h-full">
        {/* Fixed marker icon in center */}
        <div style={markerCenterStyle}>📍</div>
            <button
            style={positionButtonStyle}
              onClick={onConfirm}
            >
              Confirm
            </button>

        <MapContainer
          center={[RESTAURANT.lat, RESTAURANT.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Restaurant marker (just for reference) */}
          <Marker position={[RESTAURANT.lat, RESTAURANT.lng]} icon={restIcon}>
            <Popup>Skyculinaire</Popup>
          </Marker>

          {/* Events handler lives inside DeliveryMap so it can call state setters */}
          <MapEvents />
        </MapContainer>
      </div>
    </div>
  );
}








// MapboxMap.jsx
// import React, { useState, useRef, useEffect } from "react";
// import L from "leaflet";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useScreenViewStore } from "../assets/store/screenViewStore";
// import { useAddressStore } from "../assets/store/addressStore";
// import { useNavigate } from "react-router-dom";
// import { useCartStore } from "../assets/store/cartStore";

// // --- Configuration ---
// const RESTAURANT = { lat: 30.094131, lng: 31.365530 };

// // Pricing logic
// const BASE_FEE = 10;
// const PER_KM = 2;
// const MIN_FEE = 10;
// const MAX_FEE = 100;

// // Helpers
// function haversineMeters(lat1, lon1, lat2, lon2) {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const R = 6371000;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
// function computeFee(distanceMeters) {
//   const km = distanceMeters / 1000;
//   const raw = BASE_FEE + PER_KM * km;
//   const fee = Math.min(MAX_FEE, Math.max(MIN_FEE, raw));
//   return Math.round(fee * 100) / 100;
// }

// // small divIcons
// const restIcon = L.divIcon({
//   className: "rest-icon",
//   html: `<img src="/images/logo.png" alt="skyculinaire" style="width:90px" />`,
//   iconAnchor: [15, 15],
// });

// // Mapbox Token
// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// export default function DeliveryMapbox() {
//   const { navBarHeight, footerHeight } = useScreenViewStore();
//   const [customerPos, setCustomerPos] = useState({
//     lat: RESTAURANT.lat + 0.01,
//     lng: RESTAURANT.lng + 0.01,
//   });
//   const [distanceMeters, setDistanceMeters] = useState(null);
//   const [durationSec, setDurationSec] = useState(null);
//   const [fee, setFee] = useState(null);
//   const [status, setStatus] = useState("idle");
//   const [addressQuery, setAddressQuery] = useState("");
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const mapRef = useRef(null);
//   const navigate = useNavigate();
//   const { address, setAddress, isAddressMap, setIsAddressMap } = useAddressStore();
//   const { setDeliveryFee } = useCartStore();

//   // --- Mapbox API Functions ---
//   async function computeRouteAndFee(destLat, destLng) {
//     setStatus("computing");
//     try {
//       const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${RESTAURANT.lng},${RESTAURANT.lat};${destLng},${destLat}?overview=full&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error("Mapbox Directions failed");
//       const data = await res.json();
//       if (data.routes && data.routes.length > 0) {
//         const d = data.routes[0].distance;
//         const dur = data.routes[0].duration;
//         setDistanceMeters(d);
//         setDurationSec(dur);
//         setFee(computeFee(d));
//         setStatus("ok");
//         return;
//       }
//       // fallback
//       const d = haversineMeters(RESTAURANT.lat, RESTAURANT.lng, destLat, destLng);
//       setDistanceMeters(d);
//       setDurationSec(null);
//       setFee(computeFee(d));
//       setStatus("fallback");
//     } catch (err) {
//       console.error("Routing error", err);
//       const d = haversineMeters(RESTAURANT.lat, RESTAURANT.lng, destLat, destLng);
//       setDistanceMeters(d);
//       setDurationSec(null);
//       setFee(computeFee(d));
//       setStatus("error");
//     }
//   }

//   async function reverseGeocode(lat, lng) {
//     try {
//       const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error("Mapbox Reverse Geocode failed");
//       const data = await res.json();
//       return data.features[0]?.place_name || null;
//     } catch (e) {
//       console.warn("reverseGeocode failed", e);
//       return null;
//     }
//   }

//   async function geocode(q) {
//     try {
//       const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         q
//       )}.json?limit=1&access_token=${MAPBOX_TOKEN}`;
//       const res = await fetch(url);
//       if (!res.ok) throw new Error("Mapbox Geocode failed");
//       const arr = await res.json();
//       if (!arr.features || arr.features.length === 0) throw new Error("No results");
//       const item = arr.features[0];
//       return { lat: item.center[1], lng: item.center[0], display_name: item.place_name };
//     } catch (e) {
//       throw e;
//     }
//   }

//   async function onSearch() {
//     if (!addressQuery) return;
//     setStatus("geocoding");
//     try {
//       const g = await geocode(addressQuery);
//       setSelectedAddress(g.display_name);
//       if (mapRef.current) mapRef.current.setView([g.lat, g.lng], 16);
//       setCustomerPos({ lat: g.lat, lng: g.lng });
//       await computeRouteAndFee(g.lat, g.lng);
//       setStatus("ok");
//     } catch (err) {
//       console.error(err);
//       alert("Geocoding failed: " + (err.message || err));
//       setStatus("error");
//     }
//   }

//   const markerCenterStyle = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -100%)",
//     fontSize: "36px",
//     zIndex: 999,
//     pointerEvents: "none",
//   };

//   const positionButtonStyle = {
//     position: "absolute",
//     bottom: "20px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     zIndex: 1000,
//     padding: "10px 20px",
//     backgroundColor: "#B88E52",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontWeight: "bold",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//     fontSize: "16px",
//     minWidth: "150px",
//   };

//   function onConfirm() {
//     setAddress(selectedAddress);
//     setIsAddressMap(true);
//     setDeliveryFee(fee);
//     navigate(-1);
//   }

//   const [mainHeight, setMainHeight] = useState(0);
//   useEffect(() => {
//     setMainHeight(window.innerHeight - (Number(footerHeight) || 0) - (Number(navBarHeight) || 0));
//   }, [footerHeight, navBarHeight]);

//   // --- Map Events ---
//   function MapEvents() {
//     const map = useMap();
//     useEffect(() => {
//       if (mapRef) mapRef.current = map;
//       setTimeout(() => map.invalidateSize?.(), 200);

//       const onMoveEnd = async () => {
//         const center = map.getCenter();
//         setCustomerPos({ lat: center.lat, lng: center.lng });
//         await computeRouteAndFee(center.lat, center.lng);
//         const addr = await reverseGeocode(center.lat, center.lng);
//         setSelectedAddress(addr);
//       };

//       map.on("moveend", onMoveEnd);
//       return () => map.off("moveend", onMoveEnd);
//     }, [map]);

//     return null;
//   }

//   // --- Main JSX ---
//   return (
//     <div style={{ height: `${mainHeight}px` }} className="bg-amber-400 flex flex-col lg:flex-row">
//       <div className="lg:w-1/3 lg:h-full h-auto w-full p-4 bg-gray-50">
//         <h1 className="lg:text-2xl text-lg font-semibold lg:mb-4 mb-1">Delivery Location</h1>
//         <div className="lg:mb-4">
//           <div className="text-sm text-gray">Selected address</div>
//           <div className="font-medium text-sm wrap-break-word">
//             {selectedAddress ?? "Move the map to choose location"}
//           </div>
//         </div>

//         <div className="mb-4 hidden lg:block">
//           <label className="block text-sm font-medium text-gray">Find address</label>
//           <div className="flex gap-2 mt-2">
//             <input
//               value={addressQuery}
//               onChange={(e) => setAddressQuery(e.target.value)}
//               className="flex-1 p-2 border rounded"
//               placeholder="Type address to geocode"
//             />
//             <button onClick={onSearch} className="px-3 py-2 bg-primary text-white rounded cursor-pointer">
//               Find
//             </button>
//           </div>
//         </div>

//         <div className="mb-2 hidden lg:block">
//           <div className="text-sm text-gray">Customer (center)</div>
//           <div className="text-sm">
//             Lat: {customerPos.lat.toFixed(6)} | Lng: {customerPos.lng.toFixed(6)}
//           </div>
//         </div>

//         <div className="mt-4 p-3 bg-white rounded shadow-sm flex lg:block items-start justify-between">
//           <div>
//             <div className="text-sm text-gray">Distance</div>
//             <div className="text-lg font-medium">{distanceMeters ? (distanceMeters / 1000).toFixed(2) + " km" : "—"}</div>
//           </div>
//           <div>
//             <div className="text-sm text-gray lg:mt-3">Duration</div>
//             <div className="text-lg font-medium">{durationSec ? Math.round(durationSec / 60) + " min" : "—"}</div>
//           </div>
//           <div>
//             <div className="text-sm text-gray lg:mt-3">Delivery Fee</div>
//             <div className="lg:text-2xl text-lg font-bold text-primary">{fee != null ? fee + " (EGP)" : "—"}</div>
//           </div>
//           <div className="text-xs text-gray-500 lg:mt-3">Mode: {status}</div>
//         </div>
//       </div>

//       <div className="flex-1 relative left-0 w-full h-full">
//         <div style={markerCenterStyle}>📍</div>
//         <button style={positionButtonStyle} onClick={onConfirm}>
//           Confirm
//         </button>

//         <MapContainer
//           center={[RESTAURANT.lat, RESTAURANT.lng]}
//           zoom={14}
//           style={{ height: "100%", width: "100%" }}
//           whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
//         >
//           <TileLayer
//             url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
//             tileSize={512}
//             zoomOffset={-1}
//           />
//           <Marker position={[RESTAURANT.lat, RESTAURANT.lng]} icon={restIcon}>
//             <Popup>Skyculinaire</Popup>
//           </Marker>
//           <MapEvents />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

