import { Client, Account, ID } from "appwrite";
import conf from "../../Conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      return await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
    } catch (err) {
      console.error("CreateAccount failed:", err);
      throw err;
    }
  }

  async login({ email, password }) {
    try {
      try {
        await this.account.deleteSessions();
      } catch (_) {
        // Ignore if no sessions exist
      }

      return await this.account.createEmailPasswordSession(
        email,
        password
      );
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }

  // NEW: Send verification email (requires user to be logged in)
  async sendVerificationEmail(verificationUrl) {
    try {
      if (!verificationUrl) {
        throw new Error("Verification URL is required");
      }
      
      // Send verification email to currently logged in user
      return await this.account.createVerification(verificationUrl);
    } catch (err) {
      console.error("Send verification email failed:", err);
      
      // Provide more specific error messages
      if (err.code === 401) {
        throw new Error("You must be logged in to send verification email");
      } else if (err.code === 400) {
        throw new Error("Invalid verification URL. Make sure domain is added to Appwrite console");
      }
      
      throw err;
    }
  }

  // Password recovery methods
async requestPasswordReset(email, resetUrl) {
    try {
        return await this.account.createRecovery(email, resetUrl);
    } catch (err) {
        console.error("Password reset request failed:", err);
        throw err;
    }
}

async confirmPasswordReset(userId, secret, newPassword) {
    try {
        return await this.account.updateRecovery(userId, secret, newPassword);
    } catch (err) {
        console.error("Password reset confirmation failed:", err);
        throw err;
    }
}

  async verifyEmail(userId, secret) {
    try {
      if (!userId || !secret) {
        throw new Error("User ID and secret are required for verification");
      }
      
      return await this.account.updateVerification(userId, secret);
    } catch (err) {
      console.error("Verify email failed:", err);
      
      if (err.code === 401) {
        throw new Error("Verification link is invalid or expired");
      }
      
      throw new Error("Verification failed. Please request a new verification email");
    }
  }

  async getVerificationStatus() {
    try {
      const user = await this.getCurrentUser();
      return user ? user.emailVerification : false;
    } catch (err) {
      console.error("Get verification status failed:", err);
      return false;
    }
  }

  async resendVerificationEmail(verificationUrl) {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error("You must be logged in to resend verification email");
      }
      
      if (user.emailVerification) {
        throw new Error("Your email is already verified");
      }
      
      return await this.sendVerificationEmail(verificationUrl);
    } catch (err) {
      console.error("Resend verification email failed:", err);
      throw err;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch {
      return null; 
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch {
      // Ignore errors
    }
  }
}

const authService = new AuthService();
export default authService;