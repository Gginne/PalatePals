
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import { useCallback } from "react";

export default function useNearbyRestaurants(sessionId){
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchAll =  useCallback( () => {

      try {
        setLoading(true)
        db.sessions.doc(sessionId)
        .collection('restaurants')
        .onSnapshot(snapshot => {
          setData(snapshot.docs.map(db.formatDoc))
        })
  
      } catch(err) {
        setError(err)
        console.log(err)
      } finally{
        setLoading(false)
      }
      
  }, [sessionId])

    useEffect(() => {

    fetchAll()
    }, [sessionId, fetchAll])

    return { data, error, loading}
}