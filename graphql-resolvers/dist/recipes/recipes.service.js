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
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const ingredients_service_1 = require("../ingredients/ingredients.service");
let RecipesService = class RecipesService {
    ingredientsService;
    constructor(ingredientsService) {
        this.ingredientsService = ingredientsService;
    }
    recipeData = [
        {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with tomatoes, mozzarella, and fresh basil',
            ingredientMappings: [
                { ingredientId: '1', quantity: 2, notes: 'sliced' },
                { ingredientId: '2', quantity: 0.5, notes: 'fresh leaves' },
                { ingredientId: '3', quantity: 0.5, notes: 'sliced' },
                { ingredientId: '4', quantity: 2, notes: 'for dough' },
                { ingredientId: '5', quantity: 0.25, notes: 'for drizzling' },
            ],
            instructions: [
                'Prepare pizza dough using flour, water, and olive oil',
                'Roll out the dough into a circle',
                'Spread sliced tomatoes over the dough',
                'Add sliced mozzarella evenly',
                'Drizzle with olive oil',
                'Bake at 450°F for 12-15 minutes',
                'Top with fresh basil leaves before serving',
            ],
            servings: 4,
            prepTimeMinutes: 30,
            cookTimeMinutes: 15,
            difficulty: 'Medium',
            tags: ['Italian', 'Vegetarian', 'Pizza'],
        },
        {
            id: '2',
            name: 'Garlic Chicken and Rice',
            description: 'Tender chicken breast with aromatic garlic served over jasmine rice',
            ingredientMappings: [
                { ingredientId: '6', quantity: 1.5, notes: 'cut into pieces' },
                { ingredientId: '7', quantity: 1, notes: 'rinsed' },
                { ingredientId: '8', quantity: 1, notes: 'minced' },
                { ingredientId: '5', quantity: 0.1, notes: 'for cooking' },
            ],
            instructions: [
                'Cook jasmine rice according to package instructions',
                'Season chicken breast pieces with salt and pepper',
                'Heat olive oil in a large skillet',
                'Cook chicken pieces until golden brown, about 6-8 minutes',
                'Add minced garlic and cook for 1 minute',
                'Cover and cook until chicken is fully cooked',
                'Serve chicken over rice',
            ],
            servings: 3,
            prepTimeMinutes: 15,
            cookTimeMinutes: 25,
            difficulty: 'Easy',
            tags: ['Protein', 'Quick Dinner', 'Gluten-Free'],
        },
        {
            id: '3',
            name: 'Caprese Salad',
            description: 'Fresh tomatoes and mozzarella with basil and olive oil',
            ingredientMappings: [
                { ingredientId: '1', quantity: 1, notes: 'sliced thick' },
                { ingredientId: '3', quantity: 0.75, notes: 'sliced' },
                { ingredientId: '2', quantity: 0.25, notes: 'whole leaves' },
                { ingredientId: '5', quantity: 0.1, notes: 'high quality' },
            ],
            instructions: [
                'Slice tomatoes into thick rounds',
                'Slice mozzarella into similar thickness',
                'Arrange tomato and mozzarella slices alternately on a plate',
                'Tuck fresh basil leaves between slices',
                'Drizzle with high-quality olive oil',
                'Season with salt and pepper to taste',
                'Let stand for 10 minutes before serving',
            ],
            servings: 2,
            prepTimeMinutes: 15,
            cookTimeMinutes: 0,
            difficulty: 'Easy',
            tags: ['Italian', 'Fresh', 'No-Cook', 'Vegetarian'],
        },
    ];
    findAll() {
        return this.recipeData.map(data => this.mapToRecipe(data));
    }
    findOne(id) {
        const recipeData = this.recipeData.find(recipe => recipe.id === id);
        return recipeData ? this.mapToRecipe(recipeData) : undefined;
    }
    findByTag(tag) {
        return this.recipeData
            .filter(recipe => recipe.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())))
            .map(data => this.mapToRecipe(data));
    }
    mapToRecipe(data) {
        const recipeIngredients = data.ingredientMappings.map(mapping => {
            const ingredient = this.ingredientsService.findOne(mapping.ingredientId);
            if (!ingredient) {
                throw new Error(`Ingredient with id ${mapping.ingredientId} not found`);
            }
            return {
                ingredient,
                quantity: mapping.quantity,
                notes: mapping.notes,
            };
        });
        const totalCost = recipeIngredients.reduce((sum, ri) => sum + (ri.ingredient.pricePerUnit * ri.quantity), 0);
        const allergens = Array.from(new Set(recipeIngredients
            .flatMap(ri => ri.ingredient.allergens || [])));
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            ingredients: recipeIngredients,
            instructions: data.instructions,
            servings: data.servings,
            prepTimeMinutes: data.prepTimeMinutes,
            cookTimeMinutes: data.cookTimeMinutes,
            difficulty: data.difficulty,
            tags: data.tags,
            totalCost: Math.round(totalCost * 100) / 100,
            allergens,
        };
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ingredients_service_1.IngredientsService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map