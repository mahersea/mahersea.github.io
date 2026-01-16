import { Ingredient } from './ingredient.entity';
import { IngredientsService } from './ingredients.service';
export declare class IngredientsResolver {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    findAll(): Ingredient[];
    findOne(id: string): Ingredient | undefined;
    findByCategory(category: string): Ingredient[];
}
