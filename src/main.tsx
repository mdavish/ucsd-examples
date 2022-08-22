import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SearchHeadlessProvider } from "@yext/search-headless-react"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SearchHeadlessProvider
      experienceVersion='PRODUCTION'
      experienceKey="uc-san-diego-taxonomy-answers"
      locale="en"
      apiKey="bce1894db0359d566d0f82971cfbfede"
      verticalKey="Professionals"
    >
      <App />
    </SearchHeadlessProvider>
  </React.StrictMode>
)
