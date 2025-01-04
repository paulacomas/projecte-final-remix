import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

const Notification: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-6 space-y-4 z-50">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-2 rounded-lg text-white ${
            notif.type === "success"
              ? "bg-green-500"
              : notif.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
