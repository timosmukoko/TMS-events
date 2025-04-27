import React from 'react';

const Footer = () => (
  <footer className="footer-custom py-3 text-center">
    <div className="container">
      <div className="row">
        {/* Column 1 */}
        <div className="col-6 col-md-3 mb-4">
          <h5 className="text-uppercase">Company</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-light text-decoration-none">About Us</a></li>
            <li><a href="/" className="text-light text-decoration-none">Careers</a></li>
            <li><a href="/" className="text-light text-decoration-none">Blog</a></li>
          </ul>
        </div>
        {/* Column 2 */}
        <div className="col-6 col-md-3 mb-4">
          <h5 className="text-uppercase">Services</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-light text-decoration-none">Event Planning</a></li>
            <li><a href="/" className="text-light text-decoration-none">Venue Booking</a></li>
            <li><a href="/" className="text-light text-decoration-none">Catering</a></li>
          </ul>
        </div>
        {/* Column 3 */}
        <div className="col-6 col-md-3 mb-4">
          <h5 className="text-uppercase">Support</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-light text-decoration-none">Help Center</a></li>
            <li><a href="/" className="text-light text-decoration-none">Privacy Policy</a></li>
            <li><a href="/" className="text-light text-decoration-none">Terms of Service</a></li>
          </ul>
        </div>
        {/* Column 4 */}
        <div className="col-6 col-md-3 mb-4">
          <h5 className="text-uppercase">Follow Us</h5>
          <ul className="list-unstyled d-flex gap-3">
            <li><a href="https://facebook.com" className="text-light"><i className="bi bi-facebook fs-4"></i></a></li>
            <li><a href="https://twitter.com" className="text-light"><i className="bi bi-twitter fs-4"></i></a></li>
            <li><a href="https://instagram.com" className="text-light"><i className="bi bi-instagram fs-4"></i></a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-3">
        <small>&copy; {new Date().getFullYear()} TMS Event. All rights reserved.</small>
      </div>
    </div>
  </footer>
);

export default Footer;
