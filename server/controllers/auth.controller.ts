import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { StudyService } from "../services/study.service.js"; // garantindo que os imports funcionem

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthController {
    static async register(req: Request, res: Response, sendVerificationEmail: Function) {
        try {
            const { name, username, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            const existingEmail = await db.select().from(users).where(eq(users.email, email));
            if (existingEmail.length > 0 && existingEmail[0].isVerified) {
                return res.status(400).json({ message: "Email already in use" });
            }

            const existingUsername = await db.select().from(users).where(eq(users.username, username));
            if (existingUsername.length > 0 && existingUsername[0].isVerified) {
                return res.status(400).json({ message: "Username already in use" });
            }

            let userId;

            if (existingEmail.length > 0) {
                const user = existingEmail[0];
                const [updatedUser] = await db.update(users).set({
                    name,
                    username,
                    passwordHash: hashedPassword,
                    verificationCode,
                    verificationCodeExpiresAt: expiresAt,
                    createdAt: new Date()
                }).where(eq(users.id, user.id)).returning();
                userId = updatedUser.id;
            } else {
                const [newUser] = await db.insert(users).values({
                    name,
                    username,
                    email,
                    passwordHash: hashedPassword,
                    isVerified: false,
                    verificationCode,
                    verificationCodeExpiresAt: expiresAt
                }).returning();
                userId = newUser.id;
            }

            await sendVerificationEmail(email, verificationCode);

            res.json({
                message: "Verification code sent",
                userId: userId,
                requiresVerification: true
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async verify(req: Request, res: Response) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({ message: "Missing email or code" });
            }

            const [user] = await db.select().from(users).where(eq(users.email, email));

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: "User already verified" });
            }

            if (user.verificationCode !== code) {
                return res.status(400).json({ message: "Invalid code" });
            }

            if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
                return res.status(400).json({ message: "Code expired" });
            }

            const [updatedUser] = await db.update(users).set({
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null
            })
                .where(eq(users.id, user.id))
                .returning();

            const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, JWT_SECRET, { expiresIn: "7d" });

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({ token, user: { id: updatedUser.id, name: updatedUser.name, username: updatedUser.username, email: updatedUser.email } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const [user] = await db.select().from(users).where(eq(users.email, email));
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            if (!user.isVerified) {
                return res.status(403).json({ message: "Please verify your email first", requiresVerification: true });
            }

            const validPassword = await bcrypt.compare(password, user.passwordHash);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({ token, user: { id: user.id, name: user.name, username: user.username, email: user.email } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getMe(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const [user] = await db.select().from(users).where(eq(users.id, userId));

            if (!user) return res.sendStatus(404);

            res.json({ id: user.id, name: user.name, username: user.username, email: user.email });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { name, username } = req.body;

            if (!name || name.trim().length < 2) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
                return res.status(400).json({ message: "Username inválido (3-20 caracteres)" });
            }

            const existing = await db.select().from(users).where(and(eq(users.username, username), eq(users.id, userId)));
            if (existing.length === 0) {
                const isTaken = await db.select().from(users).where(eq(users.username, username));
                if (isTaken.length > 0) {
                    return res.status(400).json({ message: "Username já em uso" });
                }
            }

            const [updated] = await db.update(users)
                .set({ name, username })
                .where(eq(users.id, userId))
                .returning();

            res.json({ id: updated.id, name: updated.name, username: updated.username, email: updated.email });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updatePassword(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { currentPassword, newPassword } = req.body;

            const [user] = await db.select().from(users).where(eq(users.id, userId));
            if (!user) return res.sendStatus(404);

            const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!validPassword) {
                return res.status(400).json({ message: "Senha atual incorreta" });
            }

            if (!newPassword || newPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
                return res.status(400).json({ message: "Nova senha não atende aos requisitos" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.id, userId));

            res.json({ message: "Senha atualizada com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async requestEmailChange(req: Request, res: Response, sendVerificationEmail: Function) {
        try {
            const userId = (req as any).user.id;
            const { newEmail } = req.body;

            const existing = await db.select().from(users).where(eq(users.email, newEmail));
            if (existing.length > 0 && existing[0].isVerified) {
                return res.status(400).json({ message: "Email já em uso" });
            }

            const verificationCode = crypto.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await db.update(users).set({
                verificationCode,
                verificationCodeExpiresAt: expiresAt
            }).where(eq(users.id, userId));

            await sendVerificationEmail(newEmail, verificationCode);

            res.json({ message: "Código enviado para o novo email" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async confirmEmailChange(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { newEmail, code } = req.body;

            const [user] = await db.select().from(users).where(eq(users.id, userId));
            if (!user) return res.sendStatus(404);

            if (user.verificationCode !== code || (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt)) {
                return res.status(400).json({ message: "Código inválido ou expirado" });
            }

            const [updated] = await db.update(users).set({
                email: newEmail,
                verificationCode: null,
                verificationCodeExpiresAt: null
            }).where(eq(users.id, userId)).returning();

            res.json({ id: updated.id, name: updated.name, username: updated.username, email: updated.email });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
