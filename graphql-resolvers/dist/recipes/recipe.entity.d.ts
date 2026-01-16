import { RecipeIngredient } from './recipe-ingredient.entity';
export declare class Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: RecipeIngredient[];
    instructions: string[];
    servings: number;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    difficulty: string;
    tags: string[];
    totalCost?: number;
    allergens?: string[];
}
