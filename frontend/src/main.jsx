import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // <--- CETTE LIGNE EST CRUCIALÈ !
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)