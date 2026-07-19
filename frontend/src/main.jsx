import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light'
document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme

window.addEventListener('storage', (event) => {
  if (event.key === 'theme' && (event.newValue === 'dark' || event.newValue === 'light')) {
    document.documentElement.dataset.theme = event.newValue
    document.documentElement.style.colorScheme = event.newValue
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
