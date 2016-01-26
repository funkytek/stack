import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'

const initialCollections = Map()
const initialRequests = Map()

// shallow entity state
const addEntities = (state, { meta, payload }) => {
  if (!payload.normalized) return state
  return fromJS(payload.normalized.entities).mergeDeep(state)
}
const updateEntities = (state, { meta, payload }) => {
  if (!payload.normalized) return state
  return state.mergeDeep(fromJS(payload.normalized.next.entities))
}

// request state
const setResponse = (state, { meta, payload }) => {
  if (!meta.requestId) return state
  return state.set(meta.requestId, fromJS(payload.raw))
}
const insertToResponse = (state, { meta, payload }) => {
  if (!meta.requestId) return state
  return state.update(meta.requestId, (v) => {
    var newDoc = fromJS(payload.raw)
    if (!List.isList(v)) return newDoc
    return v.push(newDoc)
  })
}
const updateResponse = (state, { meta, payload }) => {
  if (!meta.requestId) return state
  return state.update(meta.requestId, (v) => {
    var next = fromJS(payload.raw.next)
    if (!List.isList(v)) return next

    var prevId = payload.raw.prev.id
    var idx = v.findIndex((i) => i.get('id') === prevId)
    return v.set(idx, next)
  })
}

const setResponseError = (state, { meta, payload }) => {
  if (meta.requestId) {
    return state.set(meta.requestId, Map({error: payload}))
  }
  return state
}

// exported actions
export const collections = handleActions({
  'tahoe.success': addEntities,
  'tahoe.tail.insert': addEntities,
  'tahoe.tail.update': updateEntities
  // 'tahoe.tail.remove': TODO
}, initialCollections)

export const requests = handleActions({
  'tahoe.success': setResponse,
  'tahoe.failure': setResponseError,
  'tahoe.tail.insert': insertToResponse,
  'tahoe.tail.update': updateResponse
  // 'tahoe.realtime.remove': TODO
}, initialRequests)
