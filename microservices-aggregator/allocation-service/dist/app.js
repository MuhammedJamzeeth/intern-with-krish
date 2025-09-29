"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get("/rate", (req, res) => {
    const company = req.query.company || "Unknown";
    const time = Math.floor(Date.now() / 1000);
    const value = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    const response = { company, time, value };
    console.log(`Rate Service - Request for ${company}:`, response);
    res.json(response);
});
app.listen(PORT, () => {
    console.log(`Rate Service is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map