const config = require('config.json');
const { Sequelize } = require('sequelize');
module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;

    // connect to db
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false // This line will fix new error
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Beneficiarios = require('../beneficiarios/beneficiarios.model')(sequelize);
    db.Discapacitados = require('../discapacitados/discapacitados.model')(sequelize);

    // sync all models with database
    await sequelize.sync();
}