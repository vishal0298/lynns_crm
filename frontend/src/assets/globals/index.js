import moment from 'moment';

export const createdDateFormat = (value) => {
    return moment(value).format("DD MMM YYYY")
}