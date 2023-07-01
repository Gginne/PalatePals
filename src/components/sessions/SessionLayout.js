import React, {useEffect} from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { db } from "../../firebase"

export default function SessionLayout() {

  const { currentUser } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(null);

  let { sessionId } = useParams();


  useEffect(() => {
    
    const validateUser = async () => {
      try {
        const doc = await db.sessions.doc(sessionId).get();
        const users = doc.data().users;
        setIsAuthorized(users.includes(currentUser.uid));
      } catch (err) {
        console.log(err);
      }
    };

    validateUser();
  }, [currentUser.uid, sessionId]);

  if(isAuthorized == null) return null;

  return isAuthorized ? (
    <>
      <Outlet />
     </>

  ) : (
    <Navigate to={"/"} replace />
  );
}
