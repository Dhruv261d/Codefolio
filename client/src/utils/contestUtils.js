// client/src/utils/contestUtils.js
export const parseFirestoreDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

export const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  const start = parseFirestoreDate(startTime);
  const end = parseFirestoreDate(endTime);

  if (!start || !end) return { text: 'Invalid Date', color: '#dc3545' };
  if (now < start) return { text: 'Upcoming', color: '#3498db' };
  if (now >= start && now < end) return { text: 'Active', color: '#2ecc71' };
  return { text: 'Finished', color: '#95a5a6' };
};
