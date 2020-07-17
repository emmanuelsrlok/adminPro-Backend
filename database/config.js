const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hoar de iniciar la DB ver logs');
    }
}


module.exports = {
    dbConnection
}