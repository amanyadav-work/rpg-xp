const { jwtVerify } = require("jose");

export const getJwtData = async (req) => {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }
        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return payload
    } catch (err) {
        return null
    }
}