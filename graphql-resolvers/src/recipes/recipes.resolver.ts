import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(() => [Recipe], { name: 'GetRecipes' })
  findAll() {
    return this.recipesService.findAll();
  }

  @Query(() => Recipe, { name: 'GetRecipe', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.recipesService.findOne(id);
  }

  @Query(() => [Recipe], { name: 'GetRecipesByTag' })
  findByTag(@Args('tag') tag: string) {
    return this.recipesService.findByTag(tag);
  }
}