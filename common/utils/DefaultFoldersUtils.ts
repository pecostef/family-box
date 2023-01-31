import { applyTemplate } from '../../services/functions/utils';
const billsAndReceiptsFolderTemplate = 'home/bills+receipts';
const billsAndReceiptsYearlyFolderTemplate = `${billsAndReceiptsFolderTemplate}/{year}`;
const financialRecordsFolderTemplate = 'home/financial-records';
const financialRecordsYearlyFolderTemplate = `${financialRecordsFolderTemplate}/{year}`;
function getDefaultFoldersTemplate(): string[] {
  return [
    'home/vital-records/',
    'home/passports+identification/',
    'home/will+deeds/',
    'home/medical-records/',
    'home/policies/',
    `${billsAndReceiptsYearlyFolderTemplate}/`,
    'home/employment+educational/',
    'home/passwords/',
    `${financialRecordsYearlyFolderTemplate}/`,
    'home/home-documents/',
  ];
}
export class DefaultFoldersUtils {
  static getDefaultFolders(year: number): string[] {
    return applyTemplate<string[]>(getDefaultFoldersTemplate(), {
      year,
    });
  }
  static getBillingAndReceiptsFolderPrefix(): string {
    const folderName = applyTemplate<string>(
      billsAndReceiptsFolderTemplate,
      {}
    );
    return `${folderName}/`;
  }

  static getYearlyBillingAndReceiptsFolderPrefix(year: number): string {
    const folderName = applyTemplate<string>(
      billsAndReceiptsYearlyFolderTemplate,
      {
        year,
      }
    );
    return `${folderName}/`;
  }

  static getFinancialRecordsFolderPrefix(): string {
    billsAndReceiptsFolderTemplate;
    const folderName = applyTemplate<string>(
      financialRecordsFolderTemplate,
      {}
    );
    return `${folderName}/`;
  }

  static getYearlyFinancialRecordsFolderPrefix(year: number): string {
    billsAndReceiptsFolderTemplate;
    const folderName = applyTemplate<string>(
      financialRecordsYearlyFolderTemplate,
      {
        year,
      }
    );
    return `${folderName}/`;
  }
}
