import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export function validationMiddleware(
  type: new () => object
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, { ...req.body });

    validate(dto).then((errors) => {
      if (errors.length > 0) {
        const validationErrors = errors.map((error) => Object.values(error.constraints || {})).flat();
        res.status(400).json({
          message: "Validation error",
          errors: validationErrors,
        });
      } else {
        req.body = dto;
        next();
      }
    });
  };
}
