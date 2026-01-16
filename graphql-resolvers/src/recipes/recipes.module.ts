import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [IngredientsModule],
  providers: [RecipesService, RecipesResolver],
})
export class RecipesModule {}