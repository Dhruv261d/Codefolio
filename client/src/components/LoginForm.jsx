import React, { useState } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyAtoruRZWCbBmtdKL_zQ2KgBVa5kqIBlvI",
  authDomain: "codefolio-dc15e.firebaseapp.com",
  projectId: "codefolio-dc15e",
  storageBucket: "codefolio-dc15e.appspot.com",
  messagingSenderId: "976455322727",
  appId: "1:976455322727:web:900bd38d98b19cfd5b18c2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

function LoginForm({ onClose, onLoginSuccess  }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // return (
  //   <div style={{
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     minHeight: '100vh',
  //     width: '100vw',
  //     backgroundColor: '#212529',
  //     fontFamily: 'Segoe UI, sans-serif',
  //     overflow: 'hidden'
  //   }}>
  //     <div style={{
  //       width: '100%',
  //       maxWidth: '400px',
  //       padding: '30px',
  //       borderRadius: '10px',
  //       backgroundColor: '#ffffff',
  //       boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  //       boxSizing: 'border-box',
  //       color: '#212529'
  //     }}>
  //       <h2 style={{
  //         marginBottom: '25px',
  //         textAlign: 'center',
  //         fontSize: '1.8rem',
  //         color: '#212529'
  //       }}>
  //         Login to Codefolio
  //       </h2>

  //       <form onSubmit={handleSubmit}>
  //         <div style={{ marginBottom: '15px' }}>
  //           <label style={{
  //             display: 'block',
  //             marginBottom: '6px',
  //             fontWeight: '600',
  //             color: '#495057'
  //           }}>
  //             Email
  //           </label>
  //           <input
  //             type="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //             style={{
  //               width: '100%',
  //               padding: '10px',
  //               border: '1px solid #ced4da',
  //               borderRadius: '6px',
  //               fontSize: '1rem',
  //               boxSizing: 'border-box'
  //             }}
  //           />
  //         </div>

  //         <div style={{ marginBottom: '15px' }}>
  //           <label style={{
  //             display: 'block',
  //             marginBottom: '6px',
  //             fontWeight: '600',
  //             color: '#495057'
  //           }}>
  //             Password
  //           </label>
  //           <input
  //             type="password"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //             required
  //             style={{
  //               width: '100%',
  //               padding: '10px',
  //               border: '1px solid #ced4da',
  //               borderRadius: '6px',
  //               fontSize: '1rem',
  //               boxSizing: 'border-box'
  //             }}
  //           />
  //         </div>

  //         <button type="submit" style={{
  //           marginTop: '10px',
  //           padding: '12px',
  //           width: '100%',
  //           backgroundColor: '#007bff',
  //           color: '#fff',
  //           border: 'none',
  //           borderRadius: '6px',
  //           fontWeight: '600',
  //           fontSize: '1rem',
  //           cursor: 'pointer',
  //           transition: 'background-color 0.3s ease'
  //         }}>
  //           Login
  //         </button>
  //          <div style={{textAlign: 'center', marginTop: '15px'}}>
  //             <button type="button" onClick={onClose} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}>
  //                 Cancel
  //             </button>
  //         </div>

  //         {message && (
  //           <p style={{
  //             marginTop: '15px',
  //             color: '#dc3545',
  //             textAlign: 'center',
  //             fontWeight: '500'
  //           }}>
  //             {message}
  //           </p>
  //         )}
  //       </form>
  //     </div>
  //   </div>
  // );

  // REPLACE the entire return statement in LoginForm.jsx with this:
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        <h2 style={{ textAlign: 'center', color: '#343a40', marginBottom: '25px' }}>Login</h2>
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ced4da', borderRadius: '4px'}}/>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#495057' }}>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ced4da', borderRadius: '4px'}}/>
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>Login</button>
            {message && <p style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{message}</p>}
        </form>
        <div style={{textAlign: 'center', marginTop: '15px'}}>
            <button type="button" onClick={onClose} style={{background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer', fontSize: '0.9rem'}}>
                Cancel
            </button>
        </div>
    </div>
  );
}

export default LoginForm;
