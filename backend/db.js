import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'primary_db',
    dialect: 'mariadb'
})

/**
 * Tabels
 */
const Profiles = sequelize.define('Profiles', {
    name: {
        type: DataTypes.STRING
    },
    domain_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    api_key: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

const Images = sequelize.define('Images', {
    src: {
        type: DataTypes.STRING,
        allowNull: false
    },
    width: {
        type: DataTypes.STRING,
        defaultValue: 'auto'
    },
    height: {
        type: DataTypes.STRING,
        defaultValue: '300'
    },
    quality: {
        type: DataTypes.STRING,
        defaultValue: 'auto'
    },
})

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    };
}

testConnection();

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Profiles: Profiles,
    Images: Images
};

export default db;