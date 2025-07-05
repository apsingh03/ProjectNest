import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate?: Date;
  devId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskCreationAttributes
  extends Optional<TaskAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;

  public title!: string;
  public description!: string;
  public status!: string;
  public devId!: number;

  public readonly dueDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ✅ 4. Initialize model
export const initTaskModel = (sequelize: Sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
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
      devId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "task",
      timestamps: false,
    }
  );
};
