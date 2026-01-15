// auth service for use in controllers to handle authentication logic
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import type {
  User,
  UserResponse,
  LoginResponse,
  LoginRequest,
  RegisterRequest,
} from "../models/User.js";
// mysql types for query results
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET;
  // when you hash the password with bcrypt, you have to give the # of salt rounds its going to hash with
  private static SALT_ROUNDS = 10;
  // business logic for user registration
  // returns a login response (with token) upon successful registration
  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    const connection = await pool.getConnection();

    try {
      // get user from email
      const [existingUsers] = await connection.query<RowDataPacket[]>(
        "SELECT UserID FROM Users WHERE UserEmail = ?",
        [userData.UserEmail]
      );
      // check to see if user already exists
      if (existingUsers.length > 0) {
        throw new Error("User already exists with this email.");
      }
      // hash the password
      const hashedPassword = await bcrypt.hash(
        userData.UserPassword,
        // here we use 10 salt rounds for hashing
        AuthService.SALT_ROUNDS
      );

      // actually insert the user into the database
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO Users 
        (UserGivenName, UserFamilyName, UserEmail, UserPassword) 
        VALUES (?, ?, ?, ?)`,
        [
          userData.UserGivenName,
          userData.UserFamilyName,
          userData.UserEmail,
          hashedPassword,
        ]
      );

      // get the user we just created
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT UserID, UserGivenName, UserFamilyName, UserEmail FROM Users WHERE UserID = ?",
        [result.insertId]
      );
      const user = users[0] as UserResponse;

      // update last login time
      await connection.query(
        "UPDATE Users SET LastLoginDateTime = NOW() WHERE UserID = ?",
        [user.UserID]
      );
      // generate a token for the user
      const token = jwt.sign(
        {
          UserID: user.UserID,
          UserEmail: user.UserEmail,
        },
        AuthService.JWT_SECRET!,
        { expiresIn: "1d" }
      );
      // build the loginResponse object and return it
      return {
        UserId: user.UserID,
        UserGivenName: user.UserGivenName,
        UserFamilyName: user.UserFamilyName,
        UserEmail: user.UserEmail,
        Token: token,
      };
    } finally {
      connection.release();
    }
  }
  // business logic for user login
  static async login(userData: LoginRequest): Promise<LoginResponse> {
    const connection = await pool.getConnection();

    try {
      // find the user by email
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM Users WHERE UserEmail = ?",
        [userData.UserEmail]
      );

      // if no user found with that email, throw error
      if (users.length === 0) {
        throw new Error("Invalid email or password.");
      }
      const user = users[0] as User;

      // compare the provided password with the stored hashed password
      const passwordValid = await bcrypt.compare(
        userData.UserPassword,
        user.UserPassword
      );
      if (!passwordValid) {
        throw new Error("Invalid email or password.");
      }

      // update last login time
      await connection.query(
        "UPDATE Users SET LastLoginDateTime = NOW() WHERE UserID = ?",
        [user.UserID]
      );
      // generate a token for the user
      const token = jwt.sign(
        {
          UserID: user.UserID,
          UserEmail: user.UserEmail,
        },
        AuthService.JWT_SECRET!,
        { expiresIn: "1d" }
      );
      // build the loginResponse object and return it
      return {
        UserId: user.UserID!,
        UserGivenName: user.UserGivenName,
        UserFamilyName: user.UserFamilyName,
        UserEmail: user.UserEmail,
        Token: token,
      };
    } finally {
      connection.release();
    }
  }
}
