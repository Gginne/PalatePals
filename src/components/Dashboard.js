import React, { useEffect, useState } from "react";

import CreateSessionModal from "./sessions/CreateSessionModal";
import SessionCard from "./sessions/SessionCard";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    return db.sessions
      .where("users", "array-contains", currentUser.uid)
      .onSnapshot((snapshot) => {
        var snap = snapshot.docs.map(db.formatDoc)
        snap.map(entry => {
          var arr = []
          entry.users.map(async user => {
            const email = await db.users.doc(user).get()
            arr.push(email.data().email)
          })
          entry.users = arr
        })
        setSessions(snap);
      });
  }, [currentUser]);
  console.log(sessions);
  return (
    <div className="container mt-5 w-100">
      <CreateSessionModal />
      <div className="row mt-2">
        
          {sessions.map((session) => (
            <div className="col-sm-6 my-1">
              <SessionCard data={session} />
            </div>
          ))}
        
      </div>
    </div>
  );
}
