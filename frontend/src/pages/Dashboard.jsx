import { useEffect, useRef, useState } from "react";
import { api } from "../Api";
import "../styles/Dashboard.css";

export default function Dashboard({ token }) {
  const [patients, setPatients] = useState([]);
  const [activeCalls, setActiveCalls] = useState({});
  const timersRef = useRef({}); 

  const [showAddModal, setShowAddModal] = useState(false);

  const [newPatient, setNewPatient] = useState({
    patientName: "",
    patientId: "",
    contact1: "",
    contact2: ""
  });

  useEffect(() => {
    api
      .get("/patient", { headers: { Authorization: token } })
      .then(res => setPatients(res.data))
      .catch(() => console.error("Failed to load patients"));
  }, [token]);

  const call = async (patient) => {
    if (activeCalls[patient._id]) return; 

    await api.post(
      "/patient/call",
      { patient },
      { headers: { Authorization: token } }
    );

    let seconds = 120;

    setActiveCalls(prev => ({
      ...prev,
      [patient._id]: seconds
    }));

    const interval = setInterval(() => {
      seconds--;

      setActiveCalls(prev => {
        if (!prev[patient._id]) {
          clearInterval(interval);
          return prev;
        }

        return {
          ...prev,
          [patient._id]: seconds
        };
      });

      if (seconds <= 0) {
        clearInterval(interval);
        delete timersRef.current[patient._id];

        setActiveCalls(prev => {
          const copy = { ...prev };
          delete copy[patient._id];
          return copy;
        });
      }
    }, 1000);

    timersRef.current[patient._id] = interval;
  };

  const cancel = async (patientId) => {
    await api.post(
      "/patient/cancel",
      { patientId },
      { headers: { Authorization: token } }
    );

    if (timersRef.current[patientId]) {
      clearInterval(timersRef.current[patientId]);
      delete timersRef.current[patientId];
    }

    setActiveCalls(prev => {
      const copy = { ...prev };
      delete copy[patientId];
      return copy;
    });
  };

  const addPatient = async () => {
    const res = await api.post(
      "/patient/add",
      newPatient,
      { headers: { Authorization: token } }
    );

    setPatients(prev => [...prev, res.data]);
    setShowAddModal(false);

    setNewPatient({
      patientName: "",
      patientId: "",
      contact1: "",
      contact2: ""
    });
  };

  const deletePatient = async (id) => {
    try {
      await api.delete(`/patient/${id}`, {
        headers: { Authorization: token }
      });
      setPatients(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete patient");
    }
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, []);

  return (
    <div className="dashboard-container">
     
      <div className="dashboard-header">
        <h2>ICU Dashboard</h2>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>+</button>
      </div>

      
      <div className="patient-list">
        {patients.length === 0 && (
          <p className="empty-msg">No patients found for this ward.</p>
        )}

        {patients.map(p => (
        <div className="patient-card" key={p._id}>

  <div className="patient-top">
    <span className="patient-name">{p.patientName}</span>

    <div className="patient-actions">
      {!activeCalls[p._id] && (
        <>
          <button
            className="call-btn"
            onClick={() => call(p)}
          >
            Call
          </button>

          <button
            className="delete-btn"
            onClick={() => deletePatient(p._id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  </div>

  
  {activeCalls[p._id] && (
    <div className="patient-row">
      <div className="patient-left">
        <div className="timer-box">
  <span className="timer-label">Time left</span>
  <span className="timer-value">
    {Math.floor(activeCalls[p._id] / 60)}:
    {(activeCalls[p._id] % 60).toString().padStart(2, "0")}
  </span>
</div>

      </div>

      <div className="patient-actions">
        <button className="call-btn calling" disabled>
          Calling…
        </button>

        <button
          className="cancel-btn"
          onClick={() => cancel(p._id)}
        >
          Cancel
        </button>

        <button
  className="delete-btn"
  onClick={() => deletePatient(p._id)}
  disabled={!!activeCalls[p._id]}
  title={activeCalls[p._id] ? "Cannot delete while calling" : "Delete patient"}
>
  Delete
</button>

      </div>
    </div>
  )}
</div>


        ))}
      </div>

    
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Patient</h3>

            <input
              placeholder="Patient Name"
              value={newPatient.patientName}
              onChange={e =>
                setNewPatient({ ...newPatient, patientName: e.target.value })
              }
            />

            <input
              placeholder="Patient ID"
              value={newPatient.patientId}
              onChange={e =>
                setNewPatient({ ...newPatient, patientId: e.target.value })
              }
            />

            <input
              placeholder="Contact 1"
              value={newPatient.contact1}
              onChange={e =>
                setNewPatient({ ...newPatient, contact1: e.target.value })
              }
            />

            <input
              placeholder="Contact 2"
              value={newPatient.contact2}
              onChange={e =>
                setNewPatient({ ...newPatient, contact2: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={addPatient}>Save</button>
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
