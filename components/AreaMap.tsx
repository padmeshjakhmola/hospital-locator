import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

interface Hospital {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity: string;
  rating?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

const AreaMap = () => {
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPermissionsAndData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Location permission is required to show nearby hospitals.");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        setUserLocation(region);
        await fetchNearbyHospitals(
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (err) {
        console.error("Error getting location:", err);
        setError("Failed to get your location. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getPermissionsAndData();
  }, []);

  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    try {
      if (!GOOGLE_API_KEY) {
        throw new Error("Google API key is not configured");
      }

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=hospital&key=${GOOGLE_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API Response:", data);

      if (data.status === "OK" && data.results) {
        const filteredHospitals = data.results
          .filter(
            (place: any) =>
              place.geometry &&
              place.geometry.location &&
              place.name &&
              place.business_status !== "CLOSED_PERMANENTLY"
          )
          .slice(0, 20);

        setHospitals(filteredHospitals);

        if (filteredHospitals.length === 0) {
          setError("No hospitals found within 3km of your location.");
        }
      } else if (data.status === "ZERO_RESULTS") {
        setError("No hospitals found nearby. Try expanding your search area.");
      } else {
        throw new Error(
          `API error: ${data.status} - ${data.error_message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError(
        "Could not fetch nearby hospitals. Please check your internet connection and try again."
      );
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const getPermissionsAndData = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        await fetchNearbyHospitals(
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (err) {
        setError("Failed to refresh data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getPermissionsAndData();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>
          Finding hospitals near you...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginBottom: 20,
            color: "red",
          }}
        >
          {error}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#0066cc",
            textDecorationLine: "underline",
          }}
          onPress={handleRetry}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Unable to get your location</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            coordinate={{
              latitude: hospital.geometry.location.lat,
              longitude: hospital.geometry.location.lng,
            }}
            title={hospital.name}
            description={`${hospital.vicinity}${
              hospital.rating ? ` • Rating: ${hospital.rating}⭐` : ""
            }`}
            pinColor="red"
          />
        ))}
      </MapView>

      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 12 }}>
          {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} found
        </Text>
      </View>
    </View>
  );
};

export default AreaMap;
