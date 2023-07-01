import React, { useEffect, useState } from "react";

import CreateSessionModal from "./sessions/CreateSessionModal";
import SessionCard from "./sessions/SessionCard";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  

  useEffect(() =>
   {
    return db.sessions
      .where("users", "array-contains", currentUser.uid)
      .onSnapshot(async (snapshot) => {
        const promises = snapshot.docs.map(async (doc) => {
          const entry = db.formatDoc(doc);
          const userIds = entry.users;
    
          const emailPromises = userIds.map(async (userId) => {
            const emailSnapshot = await db.users.doc(userId).get();
            const emailData = emailSnapshot.data();
            return emailData.email;
          });
    
          const emails = await Promise.all(emailPromises);
    
          return { ...entry, users: emails };
        });
    
        const snap = await Promise.all(promises);
        console.log(snap);
    
        setSessions(snap);
      });
  }, [currentUser]);
  
  return (
    <div className="container mt-5 w-100">
      <CreateSessionModal />
      <div className="row mt-4">
        
          {sessions.map((session) => (
            <div className="col-sm-6 my-1">
              <SessionCard data={session} />
            </div>
          ))}
        
      </div>
    </div>
  );
}
