import { actions as routeActions } from 'shasta-router'
import { createActions, bindActions } from 'shasta'
import createAPIActions from 'redux-sutro'
import localActions from 'actions/.lookup'
import _initialState from 'core/store/initialState'
const initialState = _initialState.toJS()

const actions = createActions({
  ...localActions,
  api: createAPIActions(initialState.resources),
  router: routeActions
})

export default (dispatch) =>
  bindActions(actions, dispatch)
