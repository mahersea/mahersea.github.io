import { Recipe } from './recipe.entity';
import { IngredientsService } from '../ingredients/ingredients.service';
export declare class RecipesService {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    private recipeData;
    findAll(): Recipe[];
    findOne(id: string): Recipe | undefined;
    findByTag(tag: string): Recipe[];
    private mapToRecipe;
}
