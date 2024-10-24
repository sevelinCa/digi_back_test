import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../../src/auth/auth.controller";
import { AuthService } from "../../../src/auth/auth.service";
import { AuthRegisterLoginDto } from "../../../src/auth/dto/auth-register-login.dto";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({
              message: "sign up is successful, check your email to verify!!",
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should call AuthService.register with the correct parameters and return the result", async () => {
      const dto: AuthRegisterLoginDto = {
        email: "testing@gmail.com",
        password: "strongPassword",
        firstName: "John",
        lastName: "Doe",
      };

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: "sign up is successful, check your email to verify!!",
      });
    });
  });
});
