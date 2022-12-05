import { applyTemplate } from '../../services/functions/utils';
const billsAndReceiptsFolderTemplate = '/home/{familyName}/bills+receipts';
const billsAndReceiptsYearlyFolderTemplate = `${billsAndReceiptsFolderTemplate}/{year}`;
const financialRecordsFolderTemplate = '/home/{familyName}/financial-records';
const financialRecordsYearlyFolderTemplate = `${financialRecordsFolderTemplate}/{year}`;
function getDefaultFoldersTemplate(): string[] {
  return [
    '/home/{familyName}/vital-records/',
    '/home/{familyName}/passports+identification/',
    '/home/{familyName}/will+deeds/',
    '/home/{familyName}/medical-records/',
    '/home/{familyName}/policies/',
    `${billsAndReceiptsYearlyFolderTemplate}/`,
    '/home/{familyName}/employment+educational/',
    '/home/{familyName}/passwords/',
    `${financialRecordsYearlyFolderTemplate}/`,
    '/home/{familyName}/home-documents/',
  ];
}
export class DefaultFoldersUtils {
  static getDefaultFolders(familyName: string, year: number): string[] {
    return applyTemplate<string[]>(getDefaultFoldersTemplate(), {
      familyName,
      year,
    });
  }
  static getBillingAndReceiptsFolderPrefix(familyName: string): string {
    const folderName = applyTemplate<string>(billsAndReceiptsFolderTemplate, {
      familyName,
    });
    return `${folderName}/`;
  }

  static getYearlyBillingAndReceiptsFolderPrefix(
    familyName: string,
    year: number
  ): string {
    const folderName = applyTemplate<string>(
      billsAndReceiptsYearlyFolderTemplate,
      {
        familyName,
        year,
      }
    );
    return `${folderName}/`;
  }

  static getFinancialRecordsFolderPrefix(familyName: string): string {
    billsAndReceiptsFolderTemplate;
    const folderName = applyTemplate<string>(financialRecordsFolderTemplate, {
      familyName,
    });
    return `${folderName}/`;
  }

  static getYearlyFinancialRecordsFolderPrefix(
    familyName: string,
    year: number
  ): string {
    billsAndReceiptsFolderTemplate;
    const folderName = applyTemplate<string>(
      financialRecordsYearlyFolderTemplate,
      {
        familyName,
        year,
      }
    );
    return `${folderName}/`;
  }
}
