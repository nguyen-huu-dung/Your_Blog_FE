import axios from "axios";

const axiosConfig =  axios.create({
    baseURL: process.env.REACT_APP_URL_BE
})

// Add a request interceptor
axiosConfig.interceptors.request.use(function (config) {
    document.querySelector(".loading-call-api").style.display = 'block';
    return config;
}, function (error) {
    // Do something with request error
    document.querySelector(".loading-call-api").style.display = 'none';
    return Promise.reject(error);
});

// Add a response interceptor
axiosConfig.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    document.querySelector(".loading-call-api").style.display = 'none';
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    document.querySelector(".loading-call-api").style.display = 'none';
    return Promise.reject(error);
});

export default axiosConfig;