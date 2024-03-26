import { db } from "../constants/prisma";
import { ISession, ISessionRepository } from "../interfaces/Session";

export class SessionRepository implements ISessionRepository {
    public async create (user_id: number): Promise<ISession> {
        return await db.sessions.create({ data: { user_id } });
    }

    public async update (id: string): Promise<ISession> {
        return await db.sessions.update({ 
            data: { 
                last_access: new Date(), 
                is_active: true 
            }, 
            where: { id } 
        });
    }

    public async delete (id: string): Promise<boolean> {
        return await db.sessions.delete({ where: { id } }) ? true : false;
    }

    public async deleteAllUserSessions (user_id: number): Promise<boolean> {
        return (await db.sessions.deleteMany({ where: { user_id } })).count > 0 ? true : false;
    }

    public async getById (id: string): Promise<ISession | null> {
        return await db.sessions.findUnique({ where: { id } });
    }

    public async getPreviousUserSession(user_id: number): Promise<ISession | null> {
        return await db.sessions.findFirst({ where: { user_id } });
    }
}