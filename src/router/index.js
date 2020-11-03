
import React from 'react'

import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Home from '../Home'

const FrameRoute = ()=>(
  <div>
    <Switch>
      <Route path='/' render={()=><Home />} />
      {
        // <Redirect exact from='/app' to='/a' />
      }
    </Switch>
  </div>
)




export { FrameRoute }
