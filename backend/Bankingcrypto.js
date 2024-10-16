const bcrypto = require('crypto');
const fs = require('fs');

const bencrypt = (message) => {

    publickey = bcrypto.createPublicKey(fs.readFileSync(__dirname + "/icicert/app.pythru.com.crt"))
    var buffer = Buffer.from(message);
    var encrypted = bcrypto.publicEncrypt({ key: publickey, padding: bcrypto.constants.RSA_PKCS1_PADDING }, buffer);
    return encrypted.toString("base64");
};

var bdecrypt = function(toDecrypt) {
    var privatekey = bcrypto.createPrivateKey(fs.readFileSync(__dirname + "/icicert/app.pythru.com.key"));
    var buffer = Buffer.from(toDecrypt, "base64");
    var decrypted = bcrypto.privateDecrypt({ key: privatekey, padding: bcrypto.constants.RSA_PKCS1_PADDING }, buffer);
    return decrypted.toString("utf8");
};

module.exports = {  bencrypt,  bdecrypt };

