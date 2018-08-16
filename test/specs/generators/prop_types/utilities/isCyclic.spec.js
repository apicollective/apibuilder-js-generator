const { ApiBuilderService, ApiBuilderPrimitiveType, FullyQualifiedType } = require('../../../../../src/utilities/apibuilder');
const isCyclic = require('../../../../../src/generators/prop_types/utilities/isCyclic');
const peopleApiSchema = require('../../../../fixtures/schemas/people-api.json');

const peopleService = new ApiBuilderService({ service: peopleApiSchema });

describe('isCyclic', () => {
  test('should return true for self-references', () => {
    expect(isCyclic(
      peopleService.findTypeByName('person'),
      peopleService.findTypeByName('person'),
    )).toBe(true);
  });

  test('should return true when target model contains some field that references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findTypeByName('person'),
      // "person_detail" has an optional "person" field
      peopleService.findTypeByName('person_detail'),
    )).toBe(true);
  });

  test('should return true when target model contains some field that deeply references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findTypeByName('gender'),
      // "employee" model has an optional "person" field
      // "person" model has a "gender" field
      peopleService.findTypeByName('employee'),
    )).toBe(true);
  });

  test('should return true when target union contains some union type that is the same type as the source', () => {
    expect(isCyclic(
      peopleService.findTypeByName('organization'),
      // "funder" union can be either an "organization" or "person" model
      peopleService.findTypeByName('funder'),
    )).toBe(true);
  });

  test('should return true when target union contains some union type that deeply references the same type as the source', () => {
    expect(isCyclic(
      peopleService.findTypeByName('gender'),
      // "funder" is an union that can be either an "organization" or "person" type
      // both models deeply reference the "gender" enum
      // "organization" is a model that has a field of type "[employee]"
      // "employee" is a model that has a field of type "person"
      // "person" is a model that has a field of type "gender"
      peopleService.findTypeByName('funder'),
    )).toBe(true);
  });

  test('should return false when source is a primitive type', () => {
    expect(isCyclic(
      new ApiBuilderPrimitiveType(new FullyQualifiedType('string')),
      peopleService.findTypeByName('person'),
    )).toBe(false);
  });

  test('should return false when target is a primitive type', () => {
    expect(isCyclic(
      peopleService.findTypeByName('person'),
      new ApiBuilderPrimitiveType(new FullyQualifiedType('string')),
    )).toBe(false);
  });

  test('should return false when target is a model with fields that do not reference source type', () => {
    expect(isCyclic(
      peopleService.findTypeByName('gender'),
      peopleService.findTypeByName('postal_address'),
    )).toBe(false);
  });

  test('should return false when target is an union with union types that do not reference source type', () => {
    expect(isCyclic(
      peopleService.findTypeByName('person'),
      peopleService.findTypeByName('address_country'),
    )).toBe(false);
  });
});
