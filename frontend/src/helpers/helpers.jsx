import data from '../config.json';
const BACKEND_PORT = data.BACKEND_PORT;

/**
 * Send a HTTP request to backend and return data received from backend
 * @param {*} route
 * @param {*} method
 * @param {*} body
 * @returns
 */
export const makeRequest = async (route, method, body) => {
  const token = localStorage.getItem('token');
  const baseRequest = {
    method,
    headers: {
      'Content-type': 'application/json',
    }
  };
  if (token != null) {
    baseRequest.headers.Authorization = 'Bearer ' + token;
  }
  if (body !== undefined) {
    baseRequest.body = JSON.stringify(body);
  }
  const response = await fetch(`http://localhost:${BACKEND_PORT}/${route}`, baseRequest);
  return await response.json();
}

/**
 * Convert uploaded image to a URL, from assignment 2
 * @param {*} file
 * @returns
 */
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('Provided file is not a png, jpg or jpeg image!');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });

  reader.readAsDataURL(file);

  return dataUrlPromise;
}

export const getToken = () => localStorage.getItem('token');
export const loggedIn = () => !!localStorage.getItem('token');
export const jwtDecode = token => JSON.parse(window.atob(token.split('.')[1])).email;
