import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timezone, setTimezone] = useState("UTC-6");
  const [workingDays, setWorkingDays] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
  });
  const timeSlotsUTC6 = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const timeSlotsUTC5 = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const convertStateToJson = () => {
    const currentDateString = selectedDate.toISOString().split("T")[0];
    const data = {
      date: currentDateString,
      timezone: timezone,
      workingDays: workingDays,
    };
    return JSON.stringify(data);
  };

  const saveJsonToLocalStorage = () => {
    const jsonData = convertStateToJson();
    localStorage.setItem("appData", jsonData);
  };
  useEffect(() => {
    const savedData = localStorage.getItem("appData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedDate(new Date(parsedData.date));
      setTimezone(parsedData.timezone);
      setWorkingDays(parsedData.workingDays);
    }
  }, []);

  useEffect(() => {
    saveJsonToLocalStorage();
  }, [workingDays, selectedDate, timezone]);

  const initializeWorkingDays = () => {
    const initialWorkingDays = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
    };

    const currentDateString = selectedDate.toDateString();
    const savedData = localStorage.getItem(currentDateString);

    if (savedData) {
      setWorkingDays(JSON.parse(savedData));
    } else {
      setWorkingDays(initialWorkingDays);
    }
  };

  useEffect(() => {
    const updatedTimes =
      timezone === "UTC-6"
        ? timeSlotsUTC6.map((time) => `${time} (${timezone})`)
        : timeSlotsUTC5.map((time) => `${time} (${timezone})`);

    setWorkingDays((prevWorkingDays) => {
      const updatedWorkingDays = {};
      for (const day in prevWorkingDays) {
        updatedWorkingDays[day] = {};
        for (const timeSlot of updatedTimes) {
          updatedWorkingDays[day][timeSlot] =
            prevWorkingDays[day] && prevWorkingDays[day][timeSlot];
        }
      }
      return updatedWorkingDays;
    });
  }, [timezone]);

  useEffect(() => {
    const savedData = localStorage.getItem("workingDays");
    if (savedData) {
      setWorkingDays(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    initializeWorkingDays();
  }, [selectedDate]);

  const handleDateChange = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  const handleCheckboxChange = (day, timeSlot) => {
    const updatedWorkingDays = { ...workingDays };
    updatedWorkingDays[day] = { ...workingDays[day] };
    updatedWorkingDays[day][timeSlot] = !workingDays[day][timeSlot];

    setWorkingDays(updatedWorkingDays);

    const currentDateString = selectedDate.toDateString();
    localStorage.setItem(currentDateString, JSON.stringify(updatedWorkingDays));
  };

  const isWorking = (day, timeSlot) => {
    return workingDays[day][timeSlot];
  };

  const calculateDayDate = (dayIndex) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString();
  };

  return (
    <div
      className="responsive-div"
      style={{ backgroundColor: "rgb(235, 231, 231)" }}
    >
      <div className="firstdiv">
        <p onClick={() => handleDateChange(-7)} className="clickable paragraph">
          ◀Previous Week
        </p>
        <p style={{ fontSize: "1.5rem" }}>
          {selectedDate.toLocaleDateString()}
        </p>
        <p onClick={() => handleDateChange(7)} className="clickable paragraph">
          Next Week ▶
        </p>
      </div>

      <div className="controls">
        <p>TimeZone:</p>
        <select onChange={(e) => setTimezone(e.target.value)} value={timezone}>
          <option value="UTC-6">[UTC-6] Central Standard Time</option>
          <option value="UTC-5">[UTC-5] Eastern Standard Time</option>
        </select>
      </div>

      <div className="day-container">
        <h2>Working Hours:</h2>
        {Object.keys(workingDays).map((day, index) => (
          <div key={day}>
            <div style={{ display: "flex" }}>
              <h3>
                <div style={{ color: "maroon" }}>{day}</div>
                <br />({calculateDayDate(index)})
              </h3>
              <ul className="time-slots">
                {timezone === "UTC-6"
                  ? timeSlotsUTC6.map((timeSlot) => (
                      <li key={timeSlot} className="time-slot-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={isWorking(day, timeSlot)}
                            onChange={() => handleCheckboxChange(day, timeSlot)}
                          />
                          {timeSlot}
                        </label>
                      </li>
                    ))
                  : timeSlotsUTC5.map((timeSlot) => (
                      <li key={timeSlot} className="time-slot-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={isWorking(day, timeSlot)}
                            onChange={() => handleCheckboxChange(day, timeSlot)}
                          />
                          {timeSlot}
                        </label>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
