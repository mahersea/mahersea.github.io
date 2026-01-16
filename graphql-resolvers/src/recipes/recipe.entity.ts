import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { RecipeIngredient } from './recipe-ingredient.entity';

@ObjectType()
export class Recipe {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [RecipeIngredient])
  ingredients: RecipeIngredient[];

  @Field(() => [String])
  instructions: string[];

  @Field(() => Int)
  servings: number;

  @Field(() => Int)
  prepTimeMinutes: number;

  @Field(() => Int)
  cookTimeMinutes: number;

  @Field()
  difficulty: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => Float)
  totalCost?: number;

  @Field(() => [String], { nullable: true })
  allergens?: string[];
}