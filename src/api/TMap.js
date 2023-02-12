import axios from 'axios'


export function getAddressByLatLng(lat , lng) {
  return axios.get('https://apis.map.qq.com/ws/geocoder/v1/?key=QA6BZ-Z5KLX-S2544-T6SQ7-S2HDV-AWBTA&location=' + lat + ',' + lng)
}


