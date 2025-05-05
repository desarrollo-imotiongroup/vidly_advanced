const config = require('config');

module.exports = function(){
    if(!config.get('jwtPrivateSecretKey')){
        throw new Error('Fatal error: rental_jwtPrivateKey not defind');
    }
}