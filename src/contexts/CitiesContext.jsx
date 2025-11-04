import { createContext, useContext, useState, useEffect } from "react";

const BASE_API_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  // as soon as it mounts
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_API_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (e) {
        console.error("Error in fetching cities API: " + e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_API_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch (error) {
      console.error("Error while creating city in API: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_API_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (e) {
      console.error("Error while fetching city from API: " + e.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_API_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // set the cities to remove the deleted city
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (e) {
      console.log("Error while deleting city from API: " + e.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      "CitiesContext is trying to be used outside of the CitiesProvider"
    );
  return context;
}

export { CitiesProvider, useCities };
