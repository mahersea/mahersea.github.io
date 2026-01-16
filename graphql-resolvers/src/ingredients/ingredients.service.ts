import { Injectable } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientsService {
  private ingredients: Ingredient[] = [
    {
      id: '1',
      name: 'Tomatoes',
      category: 'Vegetables',
      pricePerUnit: 2.99,
      unit: 'lb',
      description: 'Fresh organic tomatoes',
      allergens: [],
    },
    {
      id: '2',
      name: 'Basil',
      category: 'Herbs',
      pricePerUnit: 3.50,
      unit: 'bunch',
      description: 'Fresh basil leaves',
      allergens: [],
    },
    {
      id: '3',
      name: 'Mozzarella',
      category: 'Dairy',
      pricePerUnit: 5.99,
      unit: 'lb',
      description: 'Fresh mozzarella cheese',
      allergens: ['milk'],
    },
    {
      id: '4',
      name: 'Flour',
      category: 'Grains',
      pricePerUnit: 1.99,
      unit: 'lb',
      description: 'All-purpose flour',
      allergens: ['gluten'],
    },
    {
      id: '5',
      name: 'Olive Oil',
      category: 'Oils',
      pricePerUnit: 8.99,
      unit: 'bottle',
      description: 'Extra virgin olive oil',
      allergens: [],
    },
    {
      id: '6',
      name: 'Chicken Breast',
      category: 'Meat',
      pricePerUnit: 7.99,
      unit: 'lb',
      description: 'Boneless chicken breast',
      allergens: [],
    },
    {
      id: '7',
      name: 'Rice',
      category: 'Grains',
      pricePerUnit: 2.49,
      unit: 'lb',
      description: 'Jasmine rice',
      allergens: [],
    },
    {
      id: '8',
      name: 'Garlic',
      category: 'Vegetables',
      pricePerUnit: 1.99,
      unit: 'bulb',
      description: 'Fresh garlic bulb',
      allergens: [],
    },
  ];

  findAll(): Ingredient[] {
    return this.ingredients;
  }

  findOne(id: string): Ingredient | undefined {
    return this.ingredients.find(ingredient => ingredient.id === id);
  }

  findByIds(ids: string[]): Ingredient[] {
    return this.ingredients.filter(ingredient => ids.includes(ingredient.id));
  }

  findByCategory(category: string): Ingredient[] {
    return this.ingredients.filter(ingredient => ingredient.category === category);
  }
}