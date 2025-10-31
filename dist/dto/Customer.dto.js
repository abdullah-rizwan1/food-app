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
exports.EditCustomerProfileInputs = exports.CustomerLoginInputs = exports.CreateCustomerInputs = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomerInputs {
}
exports.CreateCustomerInputs = CreateCustomerInputs;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(11, 14),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(8, 132),
    __metadata("design:type", String)
], CreateCustomerInputs.prototype, "password", void 0);
class CustomerLoginInputs {
}
exports.CustomerLoginInputs = CustomerLoginInputs;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CustomerLoginInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(8, 132),
    __metadata("design:type", String)
], CustomerLoginInputs.prototype, "password", void 0);
class EditCustomerProfileInputs {
}
exports.EditCustomerProfileInputs = EditCustomerProfileInputs;
__decorate([
    (0, class_validator_1.Length)(6, 10),
    __metadata("design:type", String)
], EditCustomerProfileInputs.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 10),
    __metadata("design:type", String)
], EditCustomerProfileInputs.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 10),
    __metadata("design:type", String)
], EditCustomerProfileInputs.prototype, "address", void 0);
//# sourceMappingURL=Customer.dto.js.map