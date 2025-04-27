import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; 
import 'leaflet/dist/leaflet.css';
import EventCard from '../components/EventCard';

const TM_API_KEY = 'sR6ANVUGAiVdn953FtSGkdZxA7qTz8gH';   // <-- put your real Ticketmaster key here
const WEATHER_API_KEY = 'cc6f9d84abc4d582c9e723a4ac2457bd'; // <-- put your real OpenWeatherMap key here
const PAGE_SIZE = 12;

const irelandCities = [
  'Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford',
  'Kilkenny', 'Killarney', 'Tralee', 'Belfast', 'Derry',
  'Cavan', 'Wexford', 'Sligo', 'Donegal', 'Louth', 'Mayo'
];

Modal.setAppElement('#root');

const Events = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState({});

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    segment: '',
    keyword: '',
    location: ''
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const buildUrl = () => {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    const params = url.searchParams;
    params.set('apikey', TM_API_KEY);
    params.set('size', PAGE_SIZE);
    params.set('page', page);
    params.set('countryCode', 'IE');
    if (filters.startDate) params.set('startDateTime', `${filters.startDate}T00:00:00Z`);
    if (filters.endDate) params.set('endDateTime', `${filters.endDate}T23:59:59Z`);
    if (filters.segment) params.set('segmentName', filters.segment);
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.location) params.set('city', filters.location);
    return url.toString();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(buildUrl())
      .then(async (response) => {
        const data = response.data;
        const fetched = data._embedded?.events || [];
        setEvents(prev => (page === 0 ? fetched : [...prev, ...fetched]));
        setHasMore(fetched.length === PAGE_SIZE);

        // Fetch weather data using Axios
        const citySet = new Set(fetched.map(evt => evt._embedded?.venues[0]?.city?.name).filter(Boolean));
        const weatherMap = {};

        for (const city of citySet) {
          try {
            const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
            weatherMap[city] = {
              temp: weatherRes.data.main.temp,
              description: weatherRes.data.weather[0].description,
              icon: weatherRes.data.weather[0].icon
            };
          } catch (error) {
            console.error(`Weather fetch error for ${city}:`, error);
          }
        }

        setWeatherData(weatherMap);
      })
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleAddFavorite = (id) => {
    const updatedUser = {
      ...user,
      favorites: [...(user.favorites || []), id]
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleRemoveFavorite = (id) => {
    const updatedUser = {
      ...user,
      favorites: user.favorites.filter(fav => fav !== id)
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const loadMore = () => setPage(prev => prev + 1);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Explore Events in Ireland</h2>

      {/* Filters */}
      <div className="row mb-4 g-2">
        <div className="col-md-3">
          <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-3">
          <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-3">
          <select name="segment" className="form-select" value={filters.segment} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="Music">Music</option>
            <option value="Arts & Theatre">Theatre</option>
            <option value="Comedy">Comedy</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="keyword"
            className="form-control"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="Keyword"
          />
        </div>
        <div className="col-md-3">
          <select
            name="location"
            className="form-select"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">Select City</option>
            {irelandCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      {loading && <div className="alert alert-info">Loading events…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && events.length === 0 && <div className="alert alert-warning">No events found.</div>}

      {/* Event Cards */}
      <div className="row g-4">
        {events.map(evt => {
          const city = evt._embedded?.venues[0]?.city?.name || 'Unknown city';
          const isFavorited = user?.favorites?.includes(evt.id);
          const weather = weatherData[city];

          return (
            <EventCard
              key={evt.id}
              evt={evt}
              city={city}
              isFavorited={isFavorited}
              onToggleFavorite={id =>
                isFavorited
                  ? handleRemoveFavorite(id)
                  : handleAddFavorite(id)
              }
              weather={weather}
            />
          );
        })}
      </div>

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
