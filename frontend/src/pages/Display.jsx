import { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/Display.css"

const socket = io("https://wardly.onrender.com");

export default function Display() {

  

  const params = new URLSearchParams(window.location.search);
  const wardId = params.get("ward");

  const [patients, setPatients] = useState([]);

useEffect(() => {
  socket.on("alert", (data) => {
    setPatients(data); 
  });

  return () => socket.off("alert");
}, []);


  useEffect(() => {
    if (!wardId) return;

    socket.emit("joinWard", wardId);

    socket.on("alert", (data) => {
  console.log("DISPLAY RECEIVED ALERT:", data); 
  setAlert(data);
});

    socket.on("cancel", () => {
      setAlert(null);
    });

    return () => {
      socket.off("alert");
      socket.off("cancel");
    };
  }, [wardId]);

if (!wardId) {
  return <div className="display-error">No ward selected</div>;
}

if (patients.length === 0) {
  return <div className="display-waiting">Waiting for ICU alert…</div>;
}


  return (
  <div
  className="display-grid"
  style={{
    gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(patients.length))}, 1fr)`
  }}
>
  {patients.map((p, index) => (
  <div key={index} className="display-tile blink">
    <div className="display-patient-name">{p.patientName}</div>
    <div className="display-patient-id">ID: {p.patientId}</div>
  </div>
))}


  <audio autoPlay loop src="/beep.mp3" />
</div>

);
}
