import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import CreateCategoryService from './CreateCategoryService';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    let categoryModel = await categoriesRepository.findOne({
      title: category,
    });

    if (!categoryModel) {
      const createCategoryService = new CreateCategoryService();

      categoryModel = await createCategoryService.execute({
        title: category,
      });
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total: balanceTotal } = await transactionsRepository.getBalance();
      if (balanceTotal > 0 && value > balanceTotal) {
        throw new AppError(
          `This transaction type is "outcome" and its value is greater than the total (${balanceTotal}).`,
        );
      }
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryModel,
    });

    return transactionsRepository.save(newTransaction);
  }
}

export default CreateTransactionService;
