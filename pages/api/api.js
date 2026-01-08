import axiosInstance from '../../axios/axios';

// Replace with the correct adminId where needed


// Fetch spot rates for the given adminId
export const fetchSpotRates = (adminId) => {
    return axiosInstance.get(`/get-spotrates/${adminId}`);
};

// Fetch server URL
export const fetchServerURL = async () => {
    try {
        const response = await axiosInstance.get('/get-server');
        return response;
    } catch (error) {
        console.error('Error fetching server URL:', error);
    }
};


// Fetch news for the given adminId
export const fetchNews = (adminId) => {
    return axiosInstance.get(`/get-news/${adminId}`);
};


// Fetch TV screen data
// export const fetchTVScreenData = (adminId) => {
//     return axiosInstance.get('/tv-screen', {
//         headers: { 'admin-id': adminId }
//     });
// };

export function fetchTVScreenData(adminId) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/tv-screen", true);
        xhr.setRequestHeader("admin-id", adminId);

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.status);
            }
        };

        xhr.onerror = function () {
            reject("NETWORK_ERROR");
        };

        xhr.send();
    });
}