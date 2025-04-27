import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_9pdfomx',
        'template_0m8chdl', 
        formRef.current,
        'Jw1ZWvWJ_8xjO-P3q'
      )
      .then(
        () => {
          setStatus('Message sent successfully!');
          formRef.current.reset();
        },
        (error) => {
          console.error(error.text);
          setStatus('Failed to send message. Try again later.');
        }
      );
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2>Contact Us</h2>
      {status && <p className="alert alert-info">{status}</p>}
      <form ref={formRef} onSubmit={sendEmail}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea name="message" className="form-control" rows="4" required />
        </div>
        <button type="submit" className="btn btn-success">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
