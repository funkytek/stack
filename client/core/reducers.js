import { combineReducers } from 'redux-immutablejs'
import { routeReducer } from 'redux-simple-router'
import * as apiReducers from 'redux-api-actions/reducers'
import toReducers from 'modules-to-reducers'
import localReducers from 'reducers/.lookup'

export default combineReducers({
  ...apiReducers,
  ...toReducers(localReducers),
  router: routeReducer
})
