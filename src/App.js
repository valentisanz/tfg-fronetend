import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Responsive } from 'semantic-ui-react'

import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Connect from './pages/Connect'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Responsive as={NavBar} minWidth={600} />
      <Responsive as={SideBar} maxWidth={599} />
      <Route exact path='/' component={Home} />
      <Route exact path='/home' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/profile/:username' component={Profile} />
      <Route exact path='/connect' component={Connect} />
      <Route exact path='/dashboard' component={Dashboard} />
    </Router>
  );
}

export default App;
