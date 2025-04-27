import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Replace with your actual Ticketmaster API key
const TM_API_KEY = 'sR6ANVUGAiVdn953FtSGkdZxA7qTz8gH';
const PAGE_SIZE = 4;
const CATEGORIES = ['Music', 'Arts & Theatre', 'Comedy'];

const Home = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [eventsByCategory, setEventsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events by category
  const fetchEvents = async (category) => {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    const params = url.searchParams;
    params.set('apikey', TM_API_KEY);
    params.set('size', PAGE_SIZE);
    params.set('countryCode', 'IE');
    if (category !== 'All') params.set('segmentName', category);
    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      return data._embedded?.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  // Fetch all categories once
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = {};
      for (let cat of ['All', ...CATEGORIES]) {
        results[cat] = await fetchEvents(cat);
      }
      setEventsByCategory(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Filtered events per category based on query
  const getFilteredEvents = (category) => {
    const list = eventsByCategory[category] || [];
    return list.filter(evt =>
      evt.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Handle search (local filtering)
  const handleSearch = (e) => {
    e.preventDefault();
    // Local filtering via state; no navigation
  };

  // Navigate to the Events page to see all events
  const handleViewAllEvents = () => {
    navigate('/events');
  };

  return (
    <div>
      {/* Hero & Search */}
      <div className="home-hero d-flex align-items-center justify-content-center text-white">
        <div className="text-center p-4 bg-dark bg-opacity-50 rounded">
          <h1 className="display-4 fw-bold">Welcome to TMS Event</h1>
          <p className="lead">Discover and manage unforgettable events across Ireland.</p>

          {/* Search & Filter Form */}
          <form className="mt-4" onSubmit={handleSearch}>
            <div className="input-group input-group-lg w-75 mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>

          {/* See All Events Button */}
          <button
            className="btn btn-success btn-lg mt-3"
            onClick={handleViewAllEvents}
          >
            See All Events
          </button>
        </div>
      </div>

      {/* Event Categories Section */}
      <div className="container mt-5">
        <h2 className="text-center">Featured Events</h2>

        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          (selectedCategory === 'All' ? CATEGORIES : [selectedCategory])
            .map(category => {
              const events = getFilteredEvents(category);
              return (
                <div key={category} className="mb-5">
                  <h3>{category}</h3>
                  <div className="row">
                    {events.length === 0 ? (
                      <div className="col-12 text-center">No events available.</div>
                    ) : (
                      events.map(event => (
                        <div key={event.id} className="col-sm-6 col-lg-3 mb-4">
                          <div className="card h-100 shadow-sm">
                            <img
                              src={event.images?.[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                              className="card-img-top"
                              alt={event.name}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title" style={{ fontSize: '1rem' }}>{event.name}</h5>
                              <p className="card-text text-muted mb-2">{event.dates.start.localDate}</p>
                              <p className="card-text text-muted mb-2">{event._embedded.venues[0]?.name}</p>
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-auto btn btn-sm btn-outline-primary"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Home;
