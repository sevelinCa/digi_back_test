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
exports.UserSchema = exports.UserSchemaClass = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_1 = require("../../../../../roles/domain/role");
const status_1 = require("../../../../../statuses/domain/status");
const auth_providers_enum_1 = require("../../../../../auth/auth-providers.enum");
const class_transformer_1 = require("class-transformer");
const document_entity_helper_1 = require("../../../../../utils/document-entity-helper");
const file_schema_1 = require("../../../../../files/infrastructure/persistence/document/entities/file.schema");
let UserSchemaClass = class UserSchemaClass extends document_entity_helper_1.EntityDocumentHelper {
};
exports.UserSchemaClass = UserSchemaClass;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        unique: true,
    }),
    (0, class_transformer_1.Expose)({ groups: ['me', 'admin'], toPlainOnly: true }),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserSchemaClass.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], UserSchemaClass.prototype, "previousPassword", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ groups: ['me', 'admin'], toPlainOnly: true }),
    (0, mongoose_1.Prop)({
        default: auth_providers_enum_1.AuthProvidersEnum.email,
    }),
    __metadata("design:type", String)
], UserSchemaClass.prototype, "provider", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ groups: ['me', 'admin'], toPlainOnly: true }),
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "socialId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: file_schema_1.FileSchemaClass,
    }),
    (0, class_transformer_1.Type)(() => file_schema_1.FileSchemaClass),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "photo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: role_1.Role,
    }),
    __metadata("design:type", Object)
], UserSchemaClass.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: status_1.Status,
    }),
    __metadata("design:type", status_1.Status)
], UserSchemaClass.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: mongoose_2.now }),
    __metadata("design:type", Date)
], UserSchemaClass.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: mongoose_2.now }),
    __metadata("design:type", Date)
], UserSchemaClass.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserSchemaClass.prototype, "deletedAt", void 0);
exports.UserSchemaClass = UserSchemaClass = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toJSON: {
            virtuals: true,
            getters: true,
        },
    })
], UserSchemaClass);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserSchemaClass);
exports.UserSchema.virtual('previousPassword').get(function () {
    return this.password;
});
exports.UserSchema.index({ 'role.id': 1 });
//# sourceMappingURL=user.schema.js.map