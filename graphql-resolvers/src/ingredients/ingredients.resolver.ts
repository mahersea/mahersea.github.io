import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Ingredient } from './ingredient.entity';
import { IngredientsService } from './ingredients.service';

@Resolver(() => Ingredient)
export class IngredientsResolver {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Query(() => [Ingredient], { name: 'GetIngredients' })
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Query(() => Ingredient, { name: 'GetIngredient', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Query(() => [Ingredient], { name: 'GetIngredientsByCategory' })
  findByCategory(@Args('category') category: string) {
    return this.ingredientsService.findByCategory(category);
  }
}