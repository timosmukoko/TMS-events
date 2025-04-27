import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const TM_API_KEY = 'Tickemaster API key';  // ← Replace with your Tickemaster key
const WEATHER_API_KEY = 'OpenWeather API key'; // ← Replace with your OpenWeather key

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // Fetch event details
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`, {
        params: { apikey: TM_API_KEY }
      })
      .then(res => {
        setEvent(res.data);
      })
      .catch(() => {
        setError('Failed to load event details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  // Fetch weather after event loaded
  useEffect(() => {
    if (!event) return;

    const venue = event._embedded?.venues?.[0];
    const lat = venue?.location?.latitude;
    const lon = venue?.location?.longitude;

    if (lat && lon) {
      setWeatherLoading(true);
      axios
        .get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: WEATHER_API_KEY
          }
        })
        .then(res => {
          setWeather(res.data);
        })
        .catch(err => {
          console.error('Weather API Error:', err);
          setWeatherError('Could not fetch weather data.');
        })
        .finally(() => {
          setWeatherLoading(false);
        });
    }
  }, [event]);

  if (loading) return <div className="text-center mt-5">Loading event…</div>;
  if (error)   return <div className="alert alert-danger mt-5">{error}</div>;

  const {
    name,
    dates,
    images = [],
    info,
    pleaseNote,
    priceRanges,
    url,
    _embedded,
    classifications = []
  } = event;

  const venue = _embedded?.venues?.[0] || {};
  const lat = venue.location?.latitude && parseFloat(venue.location.latitude);
  const lon = venue.location?.longitude && parseFloat(venue.location.longitude);

  const city = venue?.city?.name || venue?.state?.name || venue?.country?.name;
  const genreClass = classifications[0] || {};

  return (
    <div className="container mt-5">
      <h2 className="mb-3">{name}</h2>

      {/* Images */}
      {images.length > 0 && (
        <div className="row mb-4">
          {images.slice(0, 4).map(img => (
            <div key={img.url} className="col-6 col-md-3 mb-3">
              <img src={img.url} alt={name} className="img-fluid rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Basic Info */}
      <p><strong>Date & Time:</strong> {dates.start.localDate} {dates.start.localTime || ''}</p>
      <p><strong>Venue:</strong> {venue.name}</p>
      {city && <p><strong>Location:</strong> {city}</p>}
      {genreClass.segment?.name && <p><strong>Category:</strong> {genreClass.segment.name}</p>}
      {genreClass.genre?.name   && <p><strong>Genre:</strong>    {genreClass.genre.name}</p>}

      {/* Map */}
      {lat && lon && (
        <div className="mb-4" style={{ height: '300px' }}>
          <MapContainer center={[lat, lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lon]}>
              <Popup>{venue.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Weather */}
      <div className="mb-4">
        <h5>Current Weather</h5>
        {weatherLoading && <div>Loading weather...</div>}
        {weatherError   && <div className="text-danger">{weatherError}</div>}
        {!weatherLoading && !weatherError && weather && (
          <div className="border p-3 rounded bg-light">
            <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
            <p><strong>Condition:</strong>   {weather.weather[0].description}</p>
            <p><strong>Humidity:</strong>    {weather.main.humidity}%</p>
            <p><strong>Wind Speed:</strong>  {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>

      {/* Description */}
      {info       && <p><strong>About this event:</strong> {info}</p>}
      {pleaseNote && <p><strong>Please Note:</strong>       {pleaseNote}</p>}

      {/* Price Range */}
      {priceRanges?.length > 0 && (
        <div className="mb-4">
          <h5>Price Range</h5>
          <ul className="list-unstyled">
            {priceRanges.map((pr, idx) => (
              <li key={idx}>
                {pr.type || 'General'}: {pr.currency} {pr.min} – {pr.max}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ticket Availability */}
      {!url ? (
        <div className="alert alert-warning mt-4">
          Sorry, tickets are currently not available
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Buy Tickets
        </a>
      )}
    </div>
  );
};

export default EventDetail;
