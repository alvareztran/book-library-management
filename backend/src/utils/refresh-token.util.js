import { createHash } from "crypto";


export const hashRefreshToken = async (token) => {
    return createHash("sha256").update(token).digest("hex");
}