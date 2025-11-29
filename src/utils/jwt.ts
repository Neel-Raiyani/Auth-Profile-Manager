import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (payload: object, secret: string, options: SignOptions) => {
    return jwt.sign(
        payload as any,
        secret,
        options
    ) as string;
};
