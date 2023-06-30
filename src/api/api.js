import axios from "axios";

export const getLocation = async (location) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          )
      
          const jsonData = response.json()
          return jsonData;

    } catch (err){
        console.log(err)
        return err
    }
  };

export const getRestaurants =  async (lat, long, radius) => {

    const foursquareApiUrl = 'https://api.foursquare.com/v3/places/search';
    const version = '20230628'; // Specify the desired API versio

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
      const ll = `${lat},${long}`
      const response = await axios.get(foursquareApiUrl, {
        params: {...params, ll, radius, query: 'restaurant'}, headers }
      )

      const {results} = response.data;
      return results

    } catch(err) {
      console.log(err)
    }
}