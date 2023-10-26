import { ExtraFieldAnswerType } from "../firmhouse"

/**
 * Convert a list of extra fields to a map of extra fields by field id
 * @param extraFields List of extra fields that can be accessed from a subscription.
 * @returns Map of extra fields by field id 
 */
export const mapExtraFieldsByFieldId = (extraFields: ExtraFieldAnswerType[]) => {
    return extraFields.reduce((result, extraField) => {
        result[extraField.extraFieldId] = extraField;
        return result;
    }, {} as Record<string, ExtraFieldAnswerType>);
}