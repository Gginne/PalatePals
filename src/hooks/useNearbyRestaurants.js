
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import { useCallback } from "react";

export default function useNearbyRestaurants(sessionId){
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchAll =  useCallback(async () => {

      try {
        setLoading(true)
        const sess = await db.sessions.doc(sessionId).collection('restaurants').get()
        var arr = []
        sess.forEach(doc => arr.push(doc.data()))
        setData(arr) 
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