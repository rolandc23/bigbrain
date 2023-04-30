import API from '../api'
import getToken from './getToken'

// Logs a user out
async function SignOut () {
  const token = getToken();
  try {
    await API.post('admin/auth/logout',
      {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    alert('Already signed out!')
  }
}

export default SignOut;
