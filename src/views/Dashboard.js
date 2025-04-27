import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TM_API_KEY = 'sR6ANVUGAiVdn953FtSGkdZxA7qTz8gH'; //← Replace with your Tickemaster key

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined);
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);

      const fetchFavorites = async () => {
        if (!parsedUser.favorites || parsedUser.favorites.length === 0) {
          setFavoriteEvents([]);
          return;
        }

        const fetched = await Promise.all(
          parsedUser.favorites.map(id =>
            fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${TM_API_KEY}`)
              .then(res => res.json())
              .catch(err => {
                console.error(`Error fetching event ${id}:`, err);
                return null;
              })
          )
        );

        setFavoriteEvents(fetched.filter(Boolean));
      };

      fetchFavorites();
    } else {
      setUser(null);
    }
  }, []);

  if (user === undefined) return <div className="text-center mt-5">Loading...</div>;

  if (user === null) {
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-warning">No user data found. Please log in.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const removeFavorite = (eventId) => {
    const updatedFavs = (user.favorites || []).filter(id => id !== eventId);
    const updatedUser = { ...user, favorites: updatedFavs };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setFavoriteEvents(prev => prev.filter(evt => evt.id !== eventId));
  };

  const viewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="container mt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h2 className="fw-bold">
          Welcome, {user.firstName} {user.lastName}
        </h2>
        <p className="text-muted">Logged in as <strong>{user.email}</strong>.</p>
      </motion.div>

      <div className="row">
        {/* Left Column - Dashboard Actions */}
        <motion.div
          className="col-lg-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Dashboard Actions</h4>
            <div className="d-grid gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="btn btn-primary"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                className="btn btn-secondary"
                onClick={() => navigate('/settings')}
              >
                Settings
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Favorite Events */}
        <motion.div
          className="col-lg-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="mb-3">Your Favorites</h3>
          {favoriteEvents.length === 0 ? (
            <p className="text-muted">You have no favorite events yet.</p>
          ) : (
            <div className="row g-4">
              {favoriteEvents.map(evt => (
                <motion.div
                  key={evt.id}
                  className="col-md-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={evt.images?.[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                      className="card-img-top"
                      alt={evt.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{evt.name}</h5>
                      <p className="card-text text-muted mb-2">{evt.dates?.start?.localDate}</p>

                      <div className="d-grid gap-2 mt-auto">
                        <button
                          className="btn btn-info"
                          onClick={() => viewDetails(evt.id)}
                        >
                          View Details
                        </button>

                        <a
                          href={evt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                        >
                          Buy Tickets
                        </a>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeFavorite(evt.id)}
                        >
                          Remove Favorite
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
