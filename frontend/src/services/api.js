 const API = '';

export const get = (url) => fetch(API + url, { headers: getHeaders() });
export const post = (url, body) => fetch(API + url, {
  method: 'POST',
  headers: getHeaders(),
  body: JSON.stringify(body)
});

function getHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json',
           'Authorization': token ? 'Bearer ' + token : '' };
}
