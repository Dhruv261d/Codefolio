// client/src/components/AddStudentForm.jsx
import React, { useState } from 'react';
import { auth } from '../firebase.js';

function AddStudentForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [year, setYear] = useState('1');
  const [branch, setBranch] = useState('Computer Science');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAddStudent = async (event) => {
    event.preventDefault();
    setMessage('');
    const studentData = { email, password, name, prn, year, branch };
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/students/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(studentData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      setMessage(`Success: ${data.message}`);
      setEmail('');
      setPassword('');
      setName('');
      setPrn('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <style>{`
        .student-form {
          margin-top: 20px;
          padding: 25px;
          border: 1px solid #dee2e6;
          border-radius: 10px;
          background-color: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          max-width: 600px;
          font-family: 'Segoe UI', sans-serif;
          color: #212529;
        }

        .student-form h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: #343a40;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #495057;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 1rem;
          background-color: #f8f9fa;
          color: #212529;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #80bdff;
          background-color: #ffffff;
          color: #212529;
        }

        .form-group select {
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #343a40 50%), 
                            linear-gradient(135deg, #343a40 50%, transparent 50%);
          background-position: calc(100% - 20px) calc(1rem + 2px), calc(100% - 15px) calc(1rem + 2px);
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        .password-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .password-wrapper input {
          flex: 1;
        }

        .toggle-password {
          background: none;
          border: none;
          color: #007bff;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .toggle-password:hover {
          text-decoration: underline;
          color: #0056b3;
        }

        .submit-button {
          margin-top: 10px;
          padding: 10px 18px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .message {
          margin-top: 15px;
          font-weight: 500;
        }

        .message.success {
          color: #28a745;
        }

        .message.error {
          color: #dc3545;
        }
      `}</style>

      <form onSubmit={handleAddStudent} className="student-form">
        <h2>Add New Student</h2>

        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>PRN:</label>
          <input type="text" value={prn} onChange={(e) => setPrn(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Year (of Study):</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} required>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Final Year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Branch:</label>
          <select value={branch} onChange={(e) => setBranch(e.target.value)} required>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Add Student</button>

        {message && (
          <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </form>
    </>
  );
}

export default AddStudentForm;
