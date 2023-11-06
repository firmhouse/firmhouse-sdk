import { ExtraFieldAnswerType } from '@firmhouse/firmhouse-sdk';
import { mapExtraFieldsByFieldId } from '@firmhouse/firmhouse-sdk/lib/helpers/extra-fields';

describe('helpers/extra-fields', () => {
  describe('mapExtraFieldsByFieldId', () => {
    it('should convert a list of extra fields to a map', () => {
      const field: ExtraFieldAnswerType = {
        id: '1',
        extraFieldId: '1',
        value: 'test',
        name: 'test',
        required: true,
        fieldType: 'text',
        visibility: 'public',
        position: null,
        selectOptions: null,
      };
      const input: ExtraFieldAnswerType[] = [
        {
          id: '1',
          extraFieldId: '1',
          value: 'test',
          name: 'test',
          required: true,
          fieldType: 'text',
          visibility: 'public',
          position: null,
          selectOptions: null,
        },
        {
          id: '2',
          extraFieldId: '2',
          value: 'test2',
          name: 'test2',
          required: false,
          fieldType: 'text',
          visibility: 'public',
          position: null,
          selectOptions: null,
        },
      ];
      const output = mapExtraFieldsByFieldId(input);
      expect(output).toEqual({
        '1': input[0],
        '2': input[1],
      });
    });

    it('should return an empty object if the list is empty', () => {
      const input: ExtraFieldAnswerType[] = [];
      expect(mapExtraFieldsByFieldId(input)).toEqual({});
    });
  });
});
