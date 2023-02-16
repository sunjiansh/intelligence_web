import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sArticle',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sArticle/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sArticle',
    method: 'put',
    data
  })
}

export function getInfo(id) {
  return request({
    url: 'api/sArticle/info/' + id,
    method: 'get'
  })
}


export default { add, edit, del,getInfo }
