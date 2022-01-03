require("dotenv").config();

module.exports = { 
   type: "postgres", 
   host: process.env.DB_HOST, 
   port: 5432, 
   // username: "ioanamoflic", 
   username: "postgres",
   password: "", 
   database: "fsd_database", 
   synchronize: true, 
   logging: false, 
   entities: [
      "src/entity/**/*.ts" 
   ], 
   migrations: [ "src/migration/**/*.ts" 
   ], 
   subscribers: [ "src/subscriber/**/*.ts" 
   ], 
   cli: { 
      "entitiesDir": "src/entity", "migrationsDir": "src/migration", "subscribersDir": "src/subscriber" 
   } 
}