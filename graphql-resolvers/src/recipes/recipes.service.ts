import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { IngredientsService } from '../ingredients/ingredients.service';

interface RecipeData {
  id: string;
  name: string;
  description: string;
  ingredientMappings: Array<{
    ingredientId: string;
    quantity: number;
    notes?: string;
  }>;
  instructions: string[];
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: string;
  tags: string[];
}

@Injectable()
export class RecipesService {
  constructor(private readonly ingredientsService: IngredientsService) {}

  private recipeData: RecipeData[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with tomatoes, mozzarella, and fresh basil',
      ingredientMappings: [
        { ingredientId: '1', quantity: 2, notes: 'sliced' },
        { ingredientId: '2', quantity: 0.5, notes: 'fresh leaves' },
        { ingredientId: '3', quantity: 0.5, notes: 'sliced' },
        { ingredientId: '4', quantity: 2, notes: 'for dough' },
        { ingredientId: '5', quantity: 0.25, notes: 'for drizzling' },
      ],
      instructions: [
        'Prepare pizza dough using flour, water, and olive oil',
        'Roll out the dough into a circle',
        'Spread sliced tomatoes over the dough',
        'Add sliced mozzarella evenly',
        'Drizzle with olive oil',
        'Bake at 450°F for 12-15 minutes',
        'Top with fresh basil leaves before serving',
      ],
      servings: 4,
      prepTimeMinutes: 30,
      cookTimeMinutes: 15,
      difficulty: 'Medium',
      tags: ['Italian', 'Vegetarian', 'Pizza'],
    },
    {
      id: '2',
      name: 'Garlic Chicken and Rice',
      description: 'Tender chicken breast with aromatic garlic served over jasmine rice',
      ingredientMappings: [
        { ingredientId: '6', quantity: 1.5, notes: 'cut into pieces' },
        { ingredientId: '7', quantity: 1, notes: 'rinsed' },
        { ingredientId: '8', quantity: 1, notes: 'minced' },
        { ingredientId: '5', quantity: 0.1, notes: 'for cooking' },
      ],
      instructions: [
        'Cook jasmine rice according to package instructions',
        'Season chicken breast pieces with salt and pepper',
        'Heat olive oil in a large skillet',
        'Cook chicken pieces until golden brown, about 6-8 minutes',
        'Add minced garlic and cook for 1 minute',
        'Cover and cook until chicken is fully cooked',
        'Serve chicken over rice',
      ],
      servings: 3,
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      difficulty: 'Easy',
      tags: ['Protein', 'Quick Dinner', 'Gluten-Free'],
    },
    {
      id: '3',
      name: 'Caprese Salad',
      description: 'Fresh tomatoes and mozzarella with basil and olive oil',
      ingredientMappings: [
        { ingredientId: '1', quantity: 1, notes: 'sliced thick' },
        { ingredientId: '3', quantity: 0.75, notes: 'sliced' },
        { ingredientId: '2', quantity: 0.25, notes: 'whole leaves' },
        { ingredientId: '5', quantity: 0.1, notes: 'high quality' },
      ],
      instructions: [
        'Slice tomatoes into thick rounds',
        'Slice mozzarella into similar thickness',
        'Arrange tomato and mozzarella slices alternately on a plate',
        'Tuck fresh basil leaves between slices',
        'Drizzle with high-quality olive oil',
        'Season with salt and pepper to taste',
        'Let stand for 10 minutes before serving',
      ],
      servings: 2,
      prepTimeMinutes: 15,
      cookTimeMinutes: 0,
      difficulty: 'Easy',
      tags: ['Italian', 'Fresh', 'No-Cook', 'Vegetarian'],
    },
  ];

  findAll(): Recipe[] {
    return this.recipeData.map(data => this.mapToRecipe(data));
  }

  findOne(id: string): Recipe | undefined {
    const recipeData = this.recipeData.find(recipe => recipe.id === id);
    return recipeData ? this.mapToRecipe(recipeData) : undefined;
  }

  findByTag(tag: string): Recipe[] {
    return this.recipeData
      .filter(recipe => recipe.tags.some(t => t.toLowerCase().includes(tag.toLowerCase())))
      .map(data => this.mapToRecipe(data));
  }

  private mapToRecipe(data: RecipeData): Recipe {
    const recipeIngredients: RecipeIngredient[] = data.ingredientMappings.map(mapping => {
      const ingredient = this.ingredientsService.findOne(mapping.ingredientId);
      if (!ingredient) {
        throw new Error(`Ingredient with id ${mapping.ingredientId} not found`);
      }
      
      return {
        ingredient,
        quantity: mapping.quantity,
        notes: mapping.notes,
      };
    });

    const totalCost = recipeIngredients.reduce(
      (sum, ri) => sum + (ri.ingredient.pricePerUnit * ri.quantity),
      0
    );

    const allergens = Array.from(
      new Set(
        recipeIngredients
          .flatMap(ri => ri.ingredient.allergens || [])
      )
    );

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      ingredients: recipeIngredients,
      instructions: data.instructions,
      servings: data.servings,
      prepTimeMinutes: data.prepTimeMinutes,
      cookTimeMinutes: data.cookTimeMinutes,
      difficulty: data.difficulty,
      tags: data.tags,
      totalCost: Math.round(totalCost * 100) / 100,
      allergens,
    };
  }
}