import { describe, it, expect } from 'vitest';
import { applyTemplate } from '../functions/utils';
describe('utils', () => {
  describe('applyTemplate', () => {
    it('leaves the json untouched if no placeholder have to be substituted', () => {
      let input: any = {
        first: 'the first prop',
        second: 'second',
        third: {
          val: 3,
          anotherVal: true,
        },
        arr: [1, '2', true],
      };
      let backing: any = {};
      expect(applyTemplate(input, backing)).toEqual(input);

      input = ['1', 2, false];
      backing = {
        '1': 'nope',
      };
      expect(applyTemplate(input, backing)).toEqual(input);
    });

    it('replaces placeholder in the form {varName} usinge the backing object', () => {
      let input: any = [
        {
          name: '{name}',
          lastName: '{lastName}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: '{name}',
              },
            },
          ],
        },
      ];
      let backing: any = {
        name: 'Mario',
        lastName: 'Rossi',
      };
      let expected: any = [
        {
          name: 'Mario',
          lastName: 'Rossi',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: 'Mario',
              },
            },
          ],
        },
      ];
      expect(applyTemplate(input, backing)).toEqual(expected);

      input = {
        oneProp: {
          withNested: {
            toBeReplacedByAWholeObject: '{obj}',
          },
        },
        replaceMeWithAnArray: '{arr}',
      };

      backing = {
        obj: {
          name: 'Mario',
          withNested: {
            one: true,
          },
        },
        arr: [{}, { second: ['2', 2, true] }, {}],
      };

      expected = {
        oneProp: {
          withNested: {
            toBeReplacedByAWholeObject: {
              name: 'Mario',
              withNested: {
                one: true,
              },
            },
          },
        },
        replaceMeWithAnArray: [{}, { second: ['2', 2, true] }, {}],
      };

      expect(applyTemplate(input, backing)).toEqual(expected);
    });

    it('replaces placeholder in the form {varName} usinge the backing object also for string arrays', () => {
      const input = [
        '/home/{familyName}/vital-records/{name}',
        '/home/{familyName}/passports+identification/',
        '/home/{familyName}/will+deeds/{notFound}',
        '/home/{familyName}/medical-records/',
        '/home/{familyName}/policies/',
        '/home/{familyName}/financial-records/',
        '/home/{familyName}/employment+educational/',
        '/home/{familyName}/passwords/',
        '/home/{familyName}/bills+receipts/',
        '/home/{familyName}/home-documents/',
      ];

      const backing = {
        familyName: 'myFamily',
        name: 'john',
      };

      const expected = [
        '/home/myFamily/vital-records/john',
        '/home/myFamily/passports+identification/',
        '/home/myFamily/will+deeds/{notFound}',
        '/home/myFamily/medical-records/',
        '/home/myFamily/policies/',
        '/home/myFamily/financial-records/',
        '/home/myFamily/employment+educational/',
        '/home/myFamily/passwords/',
        '/home/myFamily/bills+receipts/',
        '/home/myFamily/home-documents/',
      ];

      expect(applyTemplate(input, backing)).toEqual(expected);
    });

    it('no replacement happens if properties are not found in the backing object', () => {
      let input: any = [
        {
          name: '{name}',
          lastName: '{lastName}',
          age: '{age}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: '{name}',
              },
            },
          ],
        },
      ];
      let backing: any = {
        name: 'Mario',
        lastName: 'Rossi',
      };
      let expected = [
        {
          name: 'Mario',
          lastName: 'Rossi',
          age: '{age}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: 'Mario',
              },
            },
          ],
        },
      ];
      expect(applyTemplate(input, backing)).toEqual(expected);
    });

    it('doeas not modify the original template', () => {
      const input: any = [
        {
          name: '{name}',
          lastName: '{lastName}',
          age: '{age}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: '{name}',
              },
            },
          ],
        },
      ];
      const backing: any = {
        name: 'Mario',
        lastName: 'Rossi',
      };

      const expected = [
        {
          name: 'Mario',
          lastName: 'Rossi',
          age: '{age}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: 'Mario',
              },
            },
          ],
        },
      ];
      expect(applyTemplate(input, backing)).toEqual(expected);
      expect(input).toEqual([
        {
          name: '{name}',
          lastName: '{lastName}',
          age: '{age}',
          friends: [
            {
              name: 'John',
              lastName: 'Doe',
              friendOf: {
                name: '{name}',
              },
            },
          ],
        },
      ]);
    });

    it('gracefully handles edge cases', () => {
      expect(applyTemplate(undefined, {})).toEqual(undefined);
      expect(applyTemplate(null, {})).toEqual(null);
      expect(applyTemplate(undefined, undefined)).toEqual(undefined);
      expect(applyTemplate(null, null)).toEqual(null);
      expect(applyTemplate({ prop: 'someval' }, null)).toEqual({
        prop: 'someval',
      });
      expect(applyTemplate({ prop: '{val}', b: null }, undefined)).toEqual({
        prop: '{val}',
        b: null,
      });
    });
  });
});
