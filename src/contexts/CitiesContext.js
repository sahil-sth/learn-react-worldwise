import { createContext, useContext, useState, useEffect } from "react";

const BASE_API_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  return (
    <CitiesContext.Provider values={{ cities, isLoading }}>
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
