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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const recipe_entity_1 = require("./recipe.entity");
const recipes_service_1 = require("./recipes.service");
let RecipesResolver = class RecipesResolver {
    recipesService;
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    findAll() {
        return this.recipesService.findAll();
    }
    findOne(id) {
        return this.recipesService.findOne(id);
    }
    findByTag(tag) {
        return this.recipesService.findByTag(tag);
    }
};
exports.RecipesResolver = RecipesResolver;
__decorate([
    (0, graphql_1.Query)(() => [recipe_entity_1.Recipe], { name: 'GetRecipes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecipesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => recipe_entity_1.Recipe, { name: 'GetRecipe', nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecipesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [recipe_entity_1.Recipe], { name: 'GetRecipesByTag' }),
    __param(0, (0, graphql_1.Args)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecipesResolver.prototype, "findByTag", null);
exports.RecipesResolver = RecipesResolver = __decorate([
    (0, graphql_1.Resolver)(() => recipe_entity_1.Recipe),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], RecipesResolver);
//# sourceMappingURL=recipes.resolver.js.map