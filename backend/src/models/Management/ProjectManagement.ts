import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// ✅ 1. Define attributes
interface ProjectManagementAttributes {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ 2. Allow some fields to be optional when creating
interface ProjectManagementCreationAttributes
  extends Optional<
    ProjectManagementAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

// ✅ 3. Extend Sequelize Model
export class ProjectManagement
  extends Model<
    ProjectManagementAttributes,
    ProjectManagementCreationAttributes
  >
  implements ProjectManagementAttributes
{
  public id!: number;

  public title!: string;
  public description!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ✅ 4. Initialize model
export const initProjectManagementModel = (sequelize: Sequelize) => {
  ProjectManagement.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProjectManagement",
      tableName: "projectManagement",
      timestamps: false, // you had timestamps false
    }
  );
};
