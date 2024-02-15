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
exports.QueryUserDto = exports.SortUserDto = exports.FilterUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const role_dto_1 = require("../../roles/dto/role.dto");
class FilterUserDto {
}
exports.FilterUserDto = FilterUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: role_dto_1.RoleDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => role_dto_1.RoleDto),
    __metadata("design:type", Object)
], FilterUserDto.prototype, "roles", void 0);
class SortUserDto {
}
exports.SortUserDto = SortUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SortUserDto.prototype, "orderBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SortUserDto.prototype, "order", void 0);
class QueryUserDto {
}
exports.QueryUserDto = QueryUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 1)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryUserDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
    }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 10)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryUserDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? (0, class_transformer_1.plainToInstance)(FilterUserDto, JSON.parse(value)) : undefined),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FilterUserDto),
    __metadata("design:type", Object)
], QueryUserDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return value ? (0, class_transformer_1.plainToInstance)(SortUserDto, JSON.parse(value)) : undefined;
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SortUserDto),
    __metadata("design:type", Object)
], QueryUserDto.prototype, "sort", void 0);
//# sourceMappingURL=query-user.dto.js.map