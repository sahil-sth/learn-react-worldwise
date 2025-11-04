// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const { createCity } = useCities();

  useEffect(
    function () {
      if (!lat && !lng) return; // do nothing if the lat and lng are not defined
      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          // throw an error if there is no country data or city data coming through the API
          if (!data.countryCode) {
            throw new Error(
              "City does not exist where you clicked. Please click on a different place on the map"
            );
          }
          setCityName(data.city || data.locality || "");
          setCountry(data.country);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setGeocodingError(error.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );
  if (isLoadingGeocoding) {
    return <Spinner />;
  }
  if (geocodingError) {
    return <Message message={geocodingError} />;
  }

  if (!lat && !lng) {
    return <Message message="Start by clicking somewhere on the map" />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      date,
      emoji,
      notes,
      position: { lat, lng },
    };
    createCity(newCity);
  }
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={(e) => setDate(e)} selected={date} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <BackButton />
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
      </div>
    </form>
  );
}

export default Form;
