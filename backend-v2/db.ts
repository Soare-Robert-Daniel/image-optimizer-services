import { Database, DataTypes, Model, MySQLConnector, Relationships } from "./deps.ts";

const connector = new MySQLConnector({
  database: Deno.env.get("DB_NAME") || "test",
  host: "primary_db",
  username: Deno.env.get("DB_USER") || "test",
  password: Deno.env.get("DB_PASSWORD") || "test",
  port: 3306, // optional
});

const db = new Database(connector);

export class User extends Model {
  static timestamps = true;
  static table = "user";
  static fields = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_key: DataTypes.STRING,
    user_name: DataTypes.STRING,
  };

  static images() {
    return this.hasMany(Image)
  }
}

export class Image extends Model {
  static timestamps = true;
  static table = "images";
  static fields = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    original_src: DataTypes.STRING,
    optm_src: DataTypes.STRING,
    user_id: Relationships.belongsTo(User)
  };

  static user() {
    return this.hasOne(User);
  }
}



// Add tables
db.link([User, Image]);

export default db;
