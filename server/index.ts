import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { AuthController } from "./controllers/auth.controller.js";
import { DeckController } from "./controllers/deck.controller.js";
import { getVerificationEmailHtml } from "./email-template.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET!;

// middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// limitadores
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Muitas tentativas. Tente novamente em 15 minutos.' });
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3, message: 'Muitas tentativas de verificação. Tente novamente em 15 minutos.' });
const apiLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100, message: 'Muitas requisições. Tente novamente em breve.' });

app.use('/api/', apiLimiter);

// middleware de autenticação
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token || (req.headers['authorization']?.split(' ')[1]);
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// ajudante de e-mail
const resend = new Resend(process.env.RESEND_API_KEY || "re_123");
const sendVerificationEmail = async (email: string, code: string) => {
  if (process.env.NODE_ENV === 'development') console.log(`[EMAIL] To: ${email}, Code: ${code}`);
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: 'Starky <contato@starky.app.br>',
      to: [email],
      subject: 'Seu código de verificação Starky',
      html: getVerificationEmailHtml(code)
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

// --- rotas ---

// rotas de autenticação
app.post("/api/auth/register", authLimiter, (req, res) => AuthController.register(req, res, sendVerificationEmail));
app.post("/api/auth/verify", verifyLimiter, (req, res) => AuthController.verify(req, res));
app.post("/api/auth/login", authLimiter, (req, res) => AuthController.login(req, res));
app.get("/api/auth/me", authenticateToken, (req, res) => AuthController.getMe(req, res));
app.put("/api/auth/profile", authenticateToken, (req, res) => AuthController.updateProfile(req, res));
app.put("/api/auth/password", authenticateToken, (req, res) => AuthController.updatePassword(req, res));
app.post("/api/auth/request-email-change", authenticateToken, (req, res) => AuthController.requestEmailChange(req, res, sendVerificationEmail));
app.put("/api/auth/confirm-email-change", authenticateToken, (req, res) => AuthController.confirmEmailChange(req, res));

// rotas de baralhos e cartões
app.get("/api/decks", authenticateToken, DeckController.getDecks);
app.post("/api/decks", authenticateToken, DeckController.createDeck);
app.put("/api/decks/:id", authenticateToken, DeckController.updateDeck);
app.delete("/api/decks/:id", authenticateToken, DeckController.deleteDeck);
app.put("/api/cards/:id", authenticateToken, DeckController.updateCardStudy);

// rotas de categoria e histórico
app.delete("/api/categories/:name", authenticateToken, DeckController.deleteCategory);
app.put("/api/categories/:name", authenticateToken, DeckController.renameCategory);
app.get("/api/history", authenticateToken, DeckController.getHistory);
app.post("/api/history", authenticateToken, DeckController.createHistory);
app.delete("/api/history", authenticateToken, DeckController.deleteHistory);

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
