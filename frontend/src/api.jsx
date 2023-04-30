import axios from 'axios';
import data from './config.json';

export default axios.create({
  baseURL: `http://localhost:${data.BACKEND_PORT}/`
});
