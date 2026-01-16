"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientsService = void 0;
const common_1 = require("@nestjs/common");
let IngredientsService = class IngredientsService {
    ingredients = [
        {
            id: '1',
            name: 'Tomatoes',
            category: 'Vegetables',
            pricePerUnit: 2.99,
            unit: 'lb',
            description: 'Fresh organic tomatoes',
            allergens: [],
        },
        {
            id: '2',
            name: 'Basil',
            category: 'Herbs',
            pricePerUnit: 3.50,
            unit: 'bunch',
            description: 'Fresh basil leaves',
            allergens: [],
        },
        {
            id: '3',
            name: 'Mozzarella',
            category: 'Dairy',
            pricePerUnit: 5.99,
            unit: 'lb',
            description: 'Fresh mozzarella cheese',
            allergens: ['milk'],
        },
        {
            id: '4',
            name: 'Flour',
            category: 'Grains',
            pricePerUnit: 1.99,
            unit: 'lb',
            description: 'All-purpose flour',
            allergens: ['gluten'],
        },
        {
            id: '5',
            name: 'Olive Oil',
            category: 'Oils',
            pricePerUnit: 8.99,
            unit: 'bottle',
            description: 'Extra virgin olive oil',
            allergens: [],
        },
        {
            id: '6',
            name: 'Chicken Breast',
            category: 'Meat',
            pricePerUnit: 7.99,
            unit: 'lb',
            description: 'Boneless chicken breast',
            allergens: [],
        },
        {
            id: '7',
            name: 'Rice',
            category: 'Grains',
            pricePerUnit: 2.49,
            unit: 'lb',
            description: 'Jasmine rice',
            allergens: [],
        },
        {
            id: '8',
            name: 'Garlic',
            category: 'Vegetables',
            pricePerUnit: 1.99,
            unit: 'bulb',
            description: 'Fresh garlic bulb',
            allergens: [],
        },
    ];
    findAll() {
        return this.ingredients;
    }
    findOne(id) {
        return this.ingredients.find(ingredient => ingredient.id === id);
    }
    findByIds(ids) {
        return this.ingredients.filter(ingredient => ids.includes(ingredient.id));
    }
    findByCategory(category) {
        return this.ingredients.filter(ingredient => ingredient.category === category);
    }
};
exports.IngredientsService = IngredientsService;
exports.IngredientsService = IngredientsService = __decorate([
    (0, common_1.Injectable)()
], IngredientsService);
//# sourceMappingURL=ingredients.service.js.map