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
exports.RecipeIngredient = void 0;
const graphql_1 = require("@nestjs/graphql");
const ingredient_entity_1 = require("../ingredients/ingredient.entity");
let RecipeIngredient = class RecipeIngredient {
    ingredient;
    quantity;
    notes;
};
exports.RecipeIngredient = RecipeIngredient;
__decorate([
    (0, graphql_1.Field)(() => ingredient_entity_1.Ingredient),
    __metadata("design:type", ingredient_entity_1.Ingredient)
], RecipeIngredient.prototype, "ingredient", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RecipeIngredient.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeIngredient.prototype, "notes", void 0);
exports.RecipeIngredient = RecipeIngredient = __decorate([
    (0, graphql_1.ObjectType)()
], RecipeIngredient);
//# sourceMappingURL=recipe-ingredient.entity.js.map