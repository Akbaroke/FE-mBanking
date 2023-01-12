import axios from 'axios';

async function Logout() {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}logout`)
  } catch (error) {
    console.log(error);
  }
}

export default Logout