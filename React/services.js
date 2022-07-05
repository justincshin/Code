import axios from 'axios';
import * as helper from './serviceHelpers';


const getAll = () => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/Listings/AvailabilityExceptions`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const getByListingId = (id) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/Listings/AvailabilityExceptions/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const addDates = (payload) => {
    const config = {
        method: 'POST',
        url: `${helper.API_HOST_PREFIX}/api/Listings/AvailabilityExceptions`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};
const getAllListings = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/listings/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const exports = { addDates, getByListingId, getAll, getAllListings };

export default exports;
