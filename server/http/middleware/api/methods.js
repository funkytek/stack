export default {
  find: {
    method: 'get',
    instance: false
  },
  create: {
    method: 'post',
    instance: false
  },
  findById: {
    method: 'get',
    instance: true
  },
  replaceById: {
    method: 'put',
    instance: true
  },
  updateById: {
    method: 'patch',
    instance: true
  },
  deleteById: {
    method: 'delete',
    instance: true
  }
}
