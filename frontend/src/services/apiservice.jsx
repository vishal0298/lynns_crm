import API from "./axioservice";
import JSONAPI from "./jsonaxioservice";

export const postData = (url, data) => {
  return new Promise((resolve, reject) => {
    JSONAPI.post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getData = (url) => {
  return new Promise((resolve, reject) => {
    JSONAPI.get(url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postDatawithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    JSONAPI.post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDataWithToken = (url, data) => {
  return new Promise((resolve, reject) => {
    JSONAPI.get(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postFormDatawithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    API.post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteDatawithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    API.post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const deletePatchDatawithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    API.patch(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const putDatawithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    API.put(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const putDataJsonwithtoken = (url, data) => {
  return new Promise((resolve, reject) => {
    JSONAPI.put(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
