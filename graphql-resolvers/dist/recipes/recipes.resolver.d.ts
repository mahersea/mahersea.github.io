import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';
export declare class RecipesResolver {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    findAll(): Recipe[];
    findOne(id: string): Recipe | undefined;
    findByTag(tag: string): Recipe[];
}
