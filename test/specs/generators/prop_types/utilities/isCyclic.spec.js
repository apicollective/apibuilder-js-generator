import { ApiBuilderService, ApiBuilderPrimitiveType, FullyQualifiedType } from '../../../../../src/utilities/apibuilder';
import isCyclic from '../../../../../src/generators/prop_types/utilities/isCyclic';
import peopleApiSchema from '../../../../fixtures/schemas/people-api.json';

const peopleService = new ApiBuilderService({ service: peopleApiSchema });

describe('isCyclic', () => {
  test('should return true for self-references', () => {
    expect(isCyclic(
      peopleService.findModelByName('person'),
      peopleService.findModelByName('person'),
    )).toBe(true);
  });

  test('should return true when target model contains some field that references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findModelByName('person'),
      // "person_detail" has an optional "person" field
      peopleService.findModelByName('person_detail'),
    )).toBe(true);
  });

  test('should return true when target model contains some field that deeply references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findEnumByName('gender'),
      // "employee" model has an optional "person" field
      // "person" model has a "gender" field
      peopleService.findModelByName('employee'),
    )).toBe(true);
  });

  test('should return true when target union contains some union type that is the same type as the source', () => {
    expect(isCyclic(
      peopleService.findModelByName('organization'),
      // "funder" union can be either an "organization" or "person" model
      peopleService.findUnionByName('funder'),
    )).toBe(true);
  });

  test('should return true when target union contains some union type that deeply references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findEnumByName('gender'),
      // "funder" is an union that can be either an "organization" or "person" type
      // both models deeply reference the "gender" enum
      // "organization" is a model that has a field of type "[employee]"
      // "employee" is a model that has a field of type "person"
      // "person" is a model that has a field of type "gender"
      peopleService.findUnionByName('funder'),
    )).toBe(true);
  });

  test('should return false when source is a primitive type', () => {
    expect(isCyclic(
      new ApiBuilderPrimitiveType(new FullyQualifiedType('string')),
      peopleService.findModelByName('person'),
    )).toBe(false);
  });

  test('should return false when target is a primitive type', () => {
    expect(isCyclic(
      peopleService.findModelByName('person'),
      new ApiBuilderPrimitiveType(new FullyQualifiedType('string')),
    )).toBe(false);
  });

  test('should return false when target is a model with fields that do not reference source type', () => {
    expect(isCyclic(
      peopleService.findEnumByName('gender'),
      peopleService.findModelByName('postal_address'),
    )).toBe(false);
  });

  test('should return false when target is an union with union types that do not reference source type', () => {
    expect(isCyclic(
      peopleService.findModelByName('person'),
      peopleService.findUnionByName('address_country'),
    )).toBe(false);
  });
});
