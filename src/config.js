import { config as dotenv} from "dotenv"
dotenv()
export const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.BD_NAME,
    port: process.env.DB_PORT,
}

export const PORT = process.env.PORT || 2000