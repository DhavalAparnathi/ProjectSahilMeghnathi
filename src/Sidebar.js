import React from "react";

const Sidebar = ({ days, currentDate }) => {
  return (
    <div className="sidebar">
      {days.map((dayInfo, index) => (
        <div
          key={index}
          className={`sidebar-item ${
            dayInfo.date === currentDate ? "highlighted" : ""
          }`}
          //   onClick={() => onDateClick(dayInfo.date)}
        >
          <div className={`date-info ${dayInfo.isPast ? "past" : ""}`}>
            {dayInfo.date}
          </div>
          {/* <div className="timeslots">
            {dayInfo.timeslots.map((time, timeIndex) => (
              <label key={timeIndex}>
                <input type="checkbox" value={time} /> {time}
              </label>
            ))}
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
