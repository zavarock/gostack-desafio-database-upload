import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  csvFileName: string;
}

class ImportTransactionsService {
  async execute({ csvFileName }: RequestDTO): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.destination, csvFileName);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const createTransactionService = new CreateTransactionService();
    const transactions: Array<Promise<Transaction>> = [];

    const parseCSV = readCSVStream.pipe(parseStream);
    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      const transaction = createTransactionService.execute({
        title,
        value,
        type,
        category,
      });

      transactions.push(transaction);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    await fs.promises.unlink(csvFilePath);

    return Promise.all(transactions);
  }
}

export default ImportTransactionsService;
