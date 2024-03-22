import { BAD_REQUEST } from "../helpers/httpResponses/generic";
import { ACTION_NOT_ALLOWED, EMAIL_CONFLICT, SUCCESSFULY_VERIFICATED, USER_NOT_FOUND } from "../helpers/httpResponses/user";
import { HttpRequest, HttpResponse, NextFunction } from "../interfaces/Http";
import { IUserUseCases } from "../interfaces/User";

export class AuthMiddleware {
    constructor(private readonly userUseCases: IUserUseCases){ }

    public async verificateUserExists(req: HttpRequest, res: HttpResponse, next?: NextFunction) {
        const user = await this.userUseCases.getByEmail(req.body.email);
        if(!user) return res.status(USER_NOT_FOUND.code).send({ message: USER_NOT_FOUND.message }) ;

        if(next){
            res.locals.user_id = user.id;
            return next();
        }
        const { email } = user;
        res.status(SUCCESSFULY_VERIFICATED.code).send({ email });
    }
    
    public async verificateUserNotExists(req: HttpRequest, res: HttpResponse, next: NextFunction) {
        const user = await this.userUseCases.getByEmail(req.body.email);
        if(user) return res.status(EMAIL_CONFLICT.code).send({ message: EMAIL_CONFLICT.message });

        next();
    }

    public async verificateValidSession (req: HttpRequest, res: HttpResponse, next: NextFunction) {
        const token = req.headers['x-access-token'];
        if(!token) return res.status(ACTION_NOT_ALLOWED.code).send({ message: ACTION_NOT_ALLOWED.message });

        const session = await this.userUseCases.getSession(token);
        if(!session) return res.status(BAD_REQUEST.code).send({ message: BAD_REQUEST.message });

        await this.userUseCases.renovateSession(session.id);

        res.locals.user_id = session.user_id;        
        next();
    }
}