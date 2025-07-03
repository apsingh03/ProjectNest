import { Sequelize } from "sequelize";
import { initUserAuthModel, UserAuth } from "./User/UserAuthModel";
import dotenv from "dotenv";
import {
  initProjectManagementModel,
  ProjectManagement,
} from "./Management/ProjectManagement";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DBNAME || "",
  process.env.DBUSER || "",
  process.env.DBPASSWORD || "",
  {
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT) || 3306,
    dialect: "mysql",
    // logging: true,
  }
);

// ✅ Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected successfully");
  } catch (error) {
    console.error("\n❌ Sequelize connection error: ", error);
  }
})();

// ✅ Init all models
initUserAuthModel(sequelize);
initProjectManagementModel(sequelize);

UserAuth.hasMany(ProjectManagement, {
  foreignKey: "devId",
  as: "UserAuth",
});
ProjectManagement.belongsTo(UserAuth, {
  foreignKey: "devId",
  as: "UserAuth",
});

// sequelize.sync({ force: false }).then(() => {
//   console.log("------------ Congratulation You are in Sync -------------- ");
// });

// ✅ Export Sequelize instance + models
export { sequelize, Sequelize, UserAuth, ProjectManagement };
