var config = {
  development: {
    //url to be used in link generation
    url: "http://localhost:7004",

    //mongodb connection settings
    database: {
      host: "127.0.0.1",
      port: "27017",
      db: "lynns-roshnroys",
      params: "",
    },

    //server details
    server: {
      host: "127.0.0.1",
      port: "7004",
    },

    secret: "LYNNS_AUTHENTICATION_SECRET_KEY",
  },
  production: {
    //url to be used in link generation image upload
    url: "",

    //mongodb connection settings
    database: {
      host: "172.31.34.10",
      port: "27017",
      db: "lynns-roshnroys",
      params: "",
    },

    //server details
    server: {
      host: "127.0.0.1",
      port: "7004",
    },

    secret: "LYNNS_AUTHENTICATION_SECRET_KEY",
  },
};

module.exports = config;
