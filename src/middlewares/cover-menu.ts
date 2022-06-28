import { Request, Response } from 'express';

export function coverMenu(req: Request, res: Response) {
    res.send(
        '<h2>Endpoints:</h2><ul><li><a href="/robots">/robots</a></li><li><a href="/users">/users</a></li></ul>'
    );
}
