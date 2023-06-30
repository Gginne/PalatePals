import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";

export default function useNearbyRestaurants(sessionId){
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const foursquareApiUrl = 'https://api.foursquare.com/v3/places/search';
    const version = '20230628'; // Specify the desired API versio
  

    useEffect(() => {
      const fetchAll = async () => {
        const session = await db.sessions.doc(sessionId).get()
        const {lat, long, radius} = session.data()

     

        const params = {
            client_id: process.env.REACT_APP_FS_CLIENT_ID,
            client_secret: process.env.REACT_APP_FS_CLIENT_SECRET,
            v: version
        }

        const headers = {
          'Accept': 'application/json',
          'Authorization': process.env.REACT_APP_FS_API_KEY,
        }

        try{
          setLoading(true)
          const ll = `${lat},${long}`
          const response = await axios.get(foursquareApiUrl, {
            params: {...params, ll, radius, query: 'restaurant'}, headers }
          )

          console.log(response)

          const {results} = response.data;
          console.log(results)
          setData(results)

          
        } catch(err) {
          setError(err)
          console.log(err)
        } finally{
          setLoading(false)
        }
        
    }

    fetchAll()
    }, [sessionId])

    
 

    return { data, error, loading}
}