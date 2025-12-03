export class ClientError extends Error { }

export function handleClientErrors(err, _req, res, next) {

    if (err instanceof ClientError) {

        res.status(400).send({ message: err.message });

    } else {

        next(err);

    }

}

