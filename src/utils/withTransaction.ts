import mongoose from "mongoose";

export async function runTransaction<T>(
    callback: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {

    const session = await mongoose.startSession();

    try {
        let result: T;

        await session.withTransaction(async () => {
            result = await callback(session);
        });

        return result!;
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}