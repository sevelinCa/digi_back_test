"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const lower_case_transformer_1 = require("../../utils/transformers/lower-case.transformer");
const role_dto_1 = require("../../roles/dto/role.dto");
const status_dto_1 = require("../../statuses/dto/status.dto");
const file_dto_1 = require("../../files/dto/file.dto");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test1@example.com' }),
    (0, class_transformer_1.Transform)(lower_case_transformer_1.lowerCaseTransformer),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => file_dto_1.FileDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: role_dto_1.RoleDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => role_dto_1.RoleDto),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: status_dto_1.StatusDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => status_dto_1.StatusDto),
    __metadata("design:type", status_dto_1.StatusDto)
], CreateUserDto.prototype, "status", void 0);
//# sourceMappingURL=create-user.dto.js.map