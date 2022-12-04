import { applyTemplate } from '../../services/functions/utils';
const billsAndReceiptsFolderTemplate = '/home/{familyName}/bills+receipts';
const financialRecordsFolderTemplate = '/home/{familyName}/financial-records';
function getDefaultFoldersTemplate(): string[] {
  return [
    '/home/{familyName}/vital-records/',
    '/home/{familyName}/passports+identification/',
    '/home/{familyName}/will+deeds/',
    '/home/{familyName}/medical-records/',
    '/home/{familyName}/policies/',
    `${financialRecordsFolderTemplate}/{year}/`,
    '/home/{familyName}/employment+educational/',
    '/home/{familyName}/passwords/',
    `${billsAndReceiptsFolderTemplate}/{year}/`,
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

  static getFinancialRecordsFolderPrefix(familyName: string): string {
    billsAndReceiptsFolderTemplate;
    const folderName = applyTemplate<string>(financialRecordsFolderTemplate, {
      familyName,
    });
    return `${folderName}/`;
  }
}
