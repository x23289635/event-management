import React, { useState, useEffect } from 'react';

function App() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addEvent = async () => {
    try {
      await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      setNewEvent({ title: '', date: '', location: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startEdit = (event) => {
    setEditingEvent({ ...event });
  };

  const updateEvent = async () => {
    try {
      await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent)
      });
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Event Management System</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Add New Event</h2>
        <input
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          placeholder="Event Title"
          style={inputStyle}
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          style={inputStyle}
        />
        <input
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          placeholder="Location"
          style={inputStyle}
        />
        <button onClick={addEvent} style={buttonStyle}>Add Event</button>
      </div>

      <div>
        <h2>Events List</h2>
        {events.map(event => (
          <div key={event.id} style={eventCardStyle}>
            {editingEvent && editingEvent.id === event.id ? (
              <div>
                <input
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  style={inputStyle}
                />
                <input
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  style={inputStyle}
                />
                <button onClick={updateEvent} style={saveButtonStyle}>Save</button>
                <button onClick={() => setEditingEvent(null)} style={cancelButtonStyle}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{event.title}</h3>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                <div>
                  <button onClick={() => startEdit(event)} style={editButtonStyle}>Edit</button>
                  <button onClick={() => deleteEvent(event.id)} style={deleteButtonStyle}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  width: '100%'
};

const eventCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  marginBottom: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const editButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px'
};

const deleteButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const saveButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px'
};

const cancelButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#607D8B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default App;