import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown';

const EventCard = ({ evt, city, isFavorited, onToggleFavorite, weather }) => {
  const navigate = useNavigate();
  const { status: countdown, isUrgent } = useCountdown(evt.dates.start.dateTime);

  const handleFavoriteClick = () => {
    const userStr = localStorage.getItem('user');
    let user = null;

    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Invalid user JSON in localStorage:', e);
    }

    if (!user || !user.email) {
      alert('You must be logged in to favorite events. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 100);
      return;
    }

    onToggleFavorite(evt.id);
  };

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img
          src={evt.images?.[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
          className="card-img-top"
          alt={evt.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{evt.name}</h5>
          <p className="card-text flex-grow-1">
            <strong>Date:</strong> {evt.dates.start.localDate}
          </p>
          <p className="card-text">
            <strong>City:</strong> {city}
          </p>
          <p className={`card-text fw-bold ${isUrgent ? 'text-danger' : ''}`}>
            <strong>Countdown:</strong> {countdown}
          </p>
          <p className="card-text">
            <strong>Venue:</strong> {evt._embedded.venues[0]?.name}
          </p>

          {/* Weather section */}
          {weather ? (
            <div className="card-text mt-2">
              <strong>Weather:</strong> {weather.temp}°C, {weather.description}
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt={weather.description}
                style={{ width: '30px', marginLeft: '5px' }}
              />
              <button
                className="btn btn-sm btn-info mt-2"
                onClick={() => window.open(`https://openweathermap.org/find?q=${encodeURIComponent(city)}`, '_blank')}
              >
                View Weather Forecast
              </button>
            </div>
          ) : (
            <div className="card-text mt-2 text-muted">
              Loading weather...
            </div>
          )}


          <button
            className={`btn ${isFavorited ? 'btn-warning' : 'btn-outline-warning'} mb-2`}
            onClick={handleFavoriteClick}
          >
            {isFavorited ? '★ Remove Favorite' : '☆ Add to Favorites'}
          </button>

          <button
            className="btn btn-primary mt-auto"
            onClick={() => navigate(`/event/${evt.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
