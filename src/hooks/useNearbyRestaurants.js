import axios from "axios";
import { useCallback, useEffect } from "react";
import { useState } from "react";

export default function useNearbyRestaurants(){
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const latitude = 40.748817; // Latitude of the target location
    const longitude = -73.985428; // Longitude of the target location
    const radius = 1000; // Radius in meters

    const foursquareApiUrl = 'https://api.foursquare.com/v3/places/search';
    const version = '20230628'; // Specify the desired API version

    const getNearbyRestaurants = useCallback(async () => {
          
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
          const ll = `${latitude},${longitude}`
          const response = await axios.get(foursquareApiUrl, {
            params: {...params, ll, radius, query: 'restaurant'}, headers }
          )

          const {results} = response.data;
          
          setData(results)

          
        } catch(err) {
          setError(err)
          console.log(err)
        } finally{
          setLoading(false)
        }
        
    }, [latitude, longitude])
        
    // Make the API request
    useEffect(() => {

        getNearbyRestaurants()
          
    }, [getNearbyRestaurants])
 

    return {data, error, loading}
}