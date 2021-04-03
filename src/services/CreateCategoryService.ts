import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';

interface RequestDTO {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoriesRepository = getRepository(Category);
    const findCategory = await categoriesRepository.findOne({ title });
    if (findCategory) {
      throw new AppError('There is already another category with this name.');
    }

    const category = categoriesRepository.create({ title });

    return categoriesRepository.save(category);
  }
}

export default CreateCategoryService;
