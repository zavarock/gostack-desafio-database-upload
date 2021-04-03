import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const findTransaction = await transactionsRepository.findOne({ id });
    if (!findTransaction) {
      throw new AppError('This transaction does not exist.', 404);
    }

    await transactionsRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
