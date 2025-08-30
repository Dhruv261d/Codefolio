// client/src/components/ProblemSolvingPage.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import Editor from '@monaco-editor/react';

function ProblemSolvingPage({ problemId, onBack, isPracticeMode = false }) {
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('// Your code here');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [failedTestCase, setFailedTestCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchProblemDetails = async () => {
            if (!auth.currentUser) {
                setError("You must be logged in to view a problem.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch(`http://localhost:5000/api/problems/${problemId}`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch problem details.');
                }
                const data = await response.json();
                setProblem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) {
            fetchProblemDetails();
        }
    }, [problemId]);

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (!auth.currentUser || !problemId) return;
            try {
                const idToken = await auth.currentUser.getIdToken();
                const response = await fetch(`http://localhost:5000/api/problems/${problemId}/bookmark-status`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setIsBookmarked(data.isBookmarked);
                }
            } catch (err) {
                console.error("Failed to check bookmark status:", err);
            }
        };
        checkBookmarkStatus();
    }, [problemId]);

    const handleRunCode = async () => {
        setIsProcessing(true);
        setOutput('');
        setSubmissionStatus('');
        setFailedTestCase(null);
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/execute/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    language: language,
                    code: code,
                    input: problem.sampleInput
                })
            });
            const result = await response.json();
            
            if (result.status && result.status.id > 3) {
                setOutput(`Error: ${result.status.description}\n\n${result.stderr || result.compile_output || ''}`);
            } else if (result.stdout === null) {
                setOutput('(No output)');
            } else {
                setOutput(result.stdout);
            }
        } catch (err) {
            setOutput(`An error occurred: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitCode = async () => {
    setIsProcessing(true);
    setOutput('');
    setSubmissionStatus('Submitting...');
    setFailedTestCase(null);

    // This is the new logic: choose the correct API endpoint
    const endpoint = isPracticeMode ? '/api/execute/practice' : '/api/execute/submit';

    try {
      if (!auth.currentUser) throw new Error("Authentication error.");
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          language: language,
          code: code,
          problemId: problemId
        })
      });
      const result = await response.json();
      setSubmissionStatus(result.status);
      setOutput(result.message);
      if (result.failedTestCase) {
        setFailedTestCase(result.failedTestCase);
      }
    } catch (err) {
      setSubmissionStatus('Error');
      setOutput(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
    };

    const handleBookmarkClick = async () => {
        if (!auth.currentUser || !problemId) return;
        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch(`http://localhost:5000/api/problems/${problemId}/bookmark`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (response.ok) {
                // Toggle the bookmark state to immediately update the UI
                setIsBookmarked(prev => !prev);
            }
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
            }
    };

    if (loading) return <div>Loading problem...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!problem) return <div>Problem not found.</div>;

    const styles = {
        problemContainer: { flex: 1, overflowY: 'auto', padding: '25px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#fff', color: '#212529' },
        title: { margin: '0 0 10px 0', fontSize: '1.8rem', color: '#343a40' },
        difficultyBadge: { padding: '6px 12px', backgroundColor: problem.difficulty === 'Easy' ? '#d4edda' : problem.difficulty === 'Medium' ? '#fff3cd' : '#f8d7da', color: problem.difficulty === 'Easy' ? '#155724' : problem.difficulty === 'Medium' ? '#856404' : '#721c24', borderRadius: '15px', display: 'inline-block', fontWeight: '600', fontSize: '0.9rem' },
        description: { whiteSpace: 'pre-wrap', color: '#495057', lineHeight: '1.6', marginTop: '20px' },
        sectionTitle: { marginTop: '30px', marginBottom: '10px', fontSize: '1.2rem', color: '#343a40', borderBottom: '1px solid #eee', paddingBottom: '5px' },
        preformatted: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', border: '1px solid #e9ecef', whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333' }
    };

    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Problems List</button>
            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 150px)' }}>
                {/* Left Side: Problem Description */}
                <div style={styles.problemContainer}>
                    <h2 style={styles.title}>{problem.title}</h2>
                    <button onClick={handleBookmarkClick} style={{
                            backgroundColor: isBookmarked ? '#007bff' : '#f0f0f0',
                            color: isBookmarked ? '#fff' : '#333',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer'
                        }}>
                            {isBookmarked ? 'Bookmarked ★' : 'Bookmark ☆'}
                    </button>
                    <p style={styles.difficultyBadge}>{problem.difficulty}</p>
                    <p style={styles.description}>{problem.description}</p>
                    <h3 style={styles.sectionTitle}>Constraints</h3>
                    <pre style={styles.preformatted}>{problem.constraints}</pre>
                    <h3 style={styles.sectionTitle}>Sample Input</h3>
                    <pre style={styles.preformatted}>{problem.sampleInput}</pre>
                    <h3 style={styles.sectionTitle}>Sample Output</h3>
                    <pre style={styles.preformatted}>{problem.sampleOutput}</pre>
                </div>

                {/* Right Side: Code Editor and Output */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{color: '#333'}}>Language: </label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                    {/* UPDATED: Changed flex properties for a fixed layout */}
                    <div style={{ flexGrow: 1, minHeight: 0, border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollBeyondLastLine: false }}
                        />
                    </div>
                    <div style={{ flexShrink: 0, marginTop: '10px' }}>
                        <h3 style={{color: '#333', margin: '0 0 5px 0'}}>Output:</h3>
                        <div style={{
                            backgroundColor: '#333',
                            borderRadius: '5px',
                            border: '1px solid #e9ecef',
                            height: '150px', // Fixed height for the output area
                            overflowY: 'auto', // Make it scrollable
                        }}>
                            <pre style={{
                                padding: '15px', margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word',
                                color: submissionStatus === 'Wrong Answer' || submissionStatus === 'Error' || (output || '').startsWith('Error') ? '#ff4d4d' : submissionStatus === 'Accepted' ? '#4dff4d' : '#e9ecef'
                            }}>
                                {isProcessing ? 'Processing...' : (output || 'Click "Run" or "Submit" to see the result.')}
                            </pre>
                            {failedTestCase && (
                                <div style={{padding: '0 15px 15px 15px'}}>
                                    <h4 style={{color: '#ff4d4d', margin: '15px 0 10px 0', borderTop: '1px solid #555', paddingTop: '10px'}}>Failed Test Case Details:</h4>
                                    <div><strong>Input:</strong><pre style={{...styles.preformatted, backgroundColor: '#444', color: '#fff'}}>{failedTestCase.input}</pre></div>
                                    <div><strong>Your Output:</strong><pre style={{...styles.preformatted, backgroundColor: '#444', color: '#fff'}}>{failedTestCase.actualOutput}</pre></div>
                                    <div><strong>Expected Output:</strong><pre style={{...styles.preformatted, backgroundColor: '#444', color: '#fff'}}>{failedTestCase.expectedOutput}</pre></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '10px', flexShrink: 0 }}>
                        <button onClick={handleRunCode} disabled={isProcessing} style={{ marginRight: '10px', padding: '10px 15px' }}>
                            {isProcessing ? 'Processing...' : 'Run'}
                        </button>
                        <button onClick={handleSubmitCode} disabled={isProcessing} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px' }}>
                            {isProcessing ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemSolvingPage;