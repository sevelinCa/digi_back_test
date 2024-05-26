import { HttpException, HttpStatus } from "@nestjs/common";

export class ManagerNotFoundException extends HttpException {
  constructor(managerId: string) {
    super(`Manager with ID ${managerId} not found`, HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedAccessException extends HttpException {
  constructor() {
    super("Unauthorized access", HttpStatus.UNAUTHORIZED);
  }
}

export class DataValidationException extends HttpException {
  constructor(message: string) {
    super(`Data Validation Error: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

export class DatabaseOperationException extends HttpException {
  constructor(message: string) {
    super(
      `Database Operation Error: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
export class ServiceUnavailableException extends HttpException {
  constructor(serviceName: string) {
    super(
      `${serviceName} is currently unavailable`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class CategoryNotFoundException extends Error {
  constructor(categoryId: string) {
    super(`Category with id ${categoryId} not found`);
  }
}

export class BalanceNotFoundException extends Error {
  constructor(userId: string, categoryId: string) {
    super(`Balance not found for user ${userId} and category ${categoryId}`);
  }
}

export class FixedExpeseNotFoundException extends HttpException {
  constructor(message = "Fixed Expense not found or not owned by user") {
    super(message, HttpStatus.NOT_FOUND);
  }
}
