import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App'
import Login from './pages/Login'
import Prompts from './pages/Prompts'
import { AuthProvider } from './lib/auth'
import { ThemeProvider } from './lib/theme'
import Admin from './pages/Admin'
import PublicPrompt from './pages/PublicPrompt'
import TeamFeed from './pages/TeamFeed'
import TeamPromptDetail from './pages/TeamPromptDetail'
import PromptDetails from './pages/PromptDetails'
import Root from './components/Root'
import Account from './pages/Account'
import About from './pages/About'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Prompts /> },
      { path: 'health', element: <App /> },
      { path: 'auth', element: <Login /> },
      { path: 'prompts', element: <Prompts /> },
      { path: 'prompts/:id', element: <PromptDetails /> },
      { path: 'team-feed', element: <TeamFeed /> },
      { path: 'team-feed/:promptId', element: <TeamPromptDetail /> },
      { path: 'admin', element: <Admin /> },
      { path: 'account', element: <Account /> },
      { path: 'share/:id', element: <PublicPrompt /> },
      { path: 'about', element: <About /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
