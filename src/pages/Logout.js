import axios from 'axios';

async function Logout() {
  try {
    await axios.delete(`${process.env.API}/logout`)
  } catch (error) {
    console.log(error);
  }
}

export default Logout