const filter = require('lodash/fp/filter');
const find = require('lodash/fp/find');
const includes = require('lodash/fp/includes');
const tail = require('lodash/fp/tail');
const reduce = require('lodash/fp/reduce');
const remove = require('lodash/fp/remove');

/**
 * api-internal can end up with duplicate model names within the same entity. This filter
 * removes duplicate entities while attempting to keep the ones that have the io.flow.internal
 * namespace
 */
const filterApiInternalOnly = (service, entities) => {
  const hasDuplicates =
    searchEntity => filter(entity => entity.name === searchEntity.name, entities);
  const entitiesToRemove = reduce((result, entity) => {
    const duplicates = hasDuplicates(entity);

    if (duplicates.length > 1) {
      const apiInternalEntity =
        find(searchEntity => searchEntity.id.startsWith('io.flow.internal'), duplicates);

      if (apiInternalEntity) {
        // Keep the io.flow.internal entity and remove the rest.
        return [
          ...result,
          ...filter(searchEntity => searchEntity.id !== apiInternalEntity.id, duplicates),
        ];
      }

      // Keep the first one and remove the remaining (tail)
      return [...result, ...tail(duplicates)];
    }

    return result;
  }, [], entities);

  return remove(searchEntity =>
    includes(searchEntity.id, entitiesToRemove.map(entity => entity.id)), entities);
};

module.exports = { filterApiInternalOnly };
