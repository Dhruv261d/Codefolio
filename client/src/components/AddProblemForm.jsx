// client/src/components/AddProblemForm.jsx
import React, { useState } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// --- START: FIREBASE CONFIGURATION ---
// This config is included here to prevent any import issues.
const firebaseConfig = {
  apiKey: "AIzaSyAtoruRZWCbBmtdKL_zQ2KgBVa5kqIBlvI",
  authDomain: "codefolio-dc15e.firebaseapp.com",
  projectId: "codefolio-dc15e",
  storageBucket: "codefolio-dc15e.appspot.com",
  messagingSenderId: "976455322727",
  appId: "1:976455322727:web:900bd38d98b19cfd5b18c2"
};

// Initialize Firebase safely to prevent re-initialization errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// --- END: FIREBASE CONFIGURATION ---

function AddProblemForm({ contestId, onProblemAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [points, setPoints] = useState(5);
  const [constraints, setConstraints] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [hiddenTestCases, setHiddenTestCases] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const testCases = hiddenTestCases.split('---').map(tc => {
        const [input, output] = tc.split(':::');
        return { input: input?.trim(), output: output?.trim() };
    }).filter(tc => tc.input && tc.output);

    if (testCases.length === 0) {
        setMessage('Error: Please provide hidden test cases in the correct format.');
        return;
    }

    const problemData = {
      contestId,
      title,
      description,
      difficulty,
      points,
      constraints,
      sampleInput,
      sampleOutput,
      testCases
    };

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch('http://localhost:5000/api/problems/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(problemData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add problem.');
      }
      
      setMessage(`Success: ${data.message}`);
      // Clear form
      setTitle(''); setDescription(''); setConstraints('');
      setPoints(5); setSampleInput(''); setSampleOutput(''); setHiddenTestCases('');
      
      if (onProblemAdded) onProblemAdded();

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Add New Problem to Contest</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Description (supports Markdown):</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="10" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} />
      </div>
       <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Difficulty:</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required style={{width: '100%', padding: '8px'}}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label>Points:</label>
                <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} required min="1" style={{width: '100%', padding: '8px', boxSizing: 'border-box'}} />
            </div>
       </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Constraints:</label>
        <textarea value={constraints} onChange={(e) => setConstraints(e.target.value)} required rows="3" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} />
      </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
            <label>Sample Input:</label>
            <textarea value={sampleInput} onChange={(e) => setSampleInput(e.target.value)} required rows="4" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} />
        </div>
        <div style={{ flex: 1 }}>
            <label>Sample Output:</label>
            <textarea value={sampleOutput} onChange={(e) => setSampleOutput(e.target.value)} required rows="4" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} />
        </div>
      </div>
       <div style={{ marginBottom: '10px' }}>
        <label>Hidden Test Cases:</label>
        <p style={{fontSize: '0.8em', color: '#666', margin: '0 0 5px 0'}}>Format: `input:::output` for each case, separated by `---`.</p>
        <textarea value={hiddenTestCases} onChange={(e) => setHiddenTestCases(e.target.value)} required rows="8" style={{width: '100%', padding: '8px', boxSizing: 'border-box', resize: 'vertical'}} placeholder={"5 10:::15\n---\n-2 3:::1"}/>
      </div>
      <button type="submit" style={{ marginTop: '10px', padding: '10px 15px' }}>Add Problem</button>
      {message && <p style={{ marginTop: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </form>
  );
}

export default AddProblemForm;