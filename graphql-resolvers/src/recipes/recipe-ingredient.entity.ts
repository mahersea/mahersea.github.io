import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Ingredient } from '../ingredients/ingredient.entity';

@ObjectType()
export class RecipeIngredient {
  @Field(() => Ingredient)
  ingredient: Ingredient;

  @Field(() => Float)
  quantity: number;

  @Field({ nullable: true })
  notes?: string;
}