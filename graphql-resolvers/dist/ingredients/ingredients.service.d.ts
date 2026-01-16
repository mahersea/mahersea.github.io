import { Ingredient } from './ingredient.entity';
export declare class IngredientsService {
    private ingredients;
    findAll(): Ingredient[];
    findOne(id: string): Ingredient | undefined;
    findByIds(ids: string[]): Ingredient[];
    findByCategory(category: string): Ingredient[];
}
