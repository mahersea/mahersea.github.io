import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Ingredient {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field(() => Float)
  pricePerUnit: number;

  @Field()
  unit: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  allergens?: string[];
}