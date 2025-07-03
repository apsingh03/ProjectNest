import { DataTypes, Model, Optional, Sequelize } from "sequelize";

// ✅ 1. Define attributes
interface UserAuthAttributes {
  id?: number; // If you have an ID primary key
  fullName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ 2. Allow some fields to be optional when creating
interface UserAuthCreationAttributes
  extends Optional<UserAuthAttributes, "id" | "createdAt" | "updatedAt"> {}

// ✅ 3. Extend Sequelize Model
export class UserAuth
  extends Model<UserAuthAttributes, UserAuthCreationAttributes>
  implements UserAuthAttributes
{
  public id!: number;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ✅ 4. Initialize model
export const initUserAuthModel = (sequelize: Sequelize) => {
  UserAuth.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
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
      modelName: "UserAuth",
      tableName: "userAuth",
      timestamps: false, // you had timestamps false
    }
  );
};
