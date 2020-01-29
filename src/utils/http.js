import axios from 'axios'

export function http(config) {
    const instance = axios.create({
        baseURL: '',
        timeout: 5000
    })

    instance.interceptors.request.use(config => {
        return config;
    }, err => {

    })

    instance.interceptors.response.use(res => {
        return res.data;
    }, err => {
        console.log(err);
    })

    return instance(config)
}