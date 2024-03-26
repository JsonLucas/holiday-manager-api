import { db } from "../constants/prisma";
import { Holiday, IHoliday, IHolidayRepository } from "../interfaces/Holiday";

export class HolidayRepository implements IHolidayRepository {
    public async create(body: Holiday[]): Promise<boolean> {
        return (await db.holidays.createMany({ data: body })).count > 0;
    }

    public async update(id: number, body: Holiday): Promise<IHoliday> {
        return await db.holidays.update({ data: body, where: { id } });
    }

    public async delete(id: number): Promise<boolean> {
        return await db.holidays.delete({ where: { id } }) ? true : false;
    }

    public async massDelete(ids: number[]): Promise<boolean> {
        const aux = await db.holidays.deleteMany({ 
            where: { 
                id: {
                    in: ids
                }
            }  
        });
        return aux.count > 0;
    }
    
    public async getById(id: number, user_id: number): Promise<IHoliday | null> {
        return await db.holidays.findUnique({ where: { id, user_id } });
    }

    public async getByUserId(user_id: number): Promise<Array<IHoliday>> {
        return await db.holidays.findMany({ where: { user_id }, orderBy: { date: 'asc' } });
    }

    public async getByDate(user_id: number, date: Date): Promise<IHoliday | null> {
        return await db.holidays.findFirst({ where: { date, user_id } });
    }
}