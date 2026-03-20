// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_queue_item.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, unnecessary_cast

extension GetSyncQueueItemCollection on Isar {
  IsarCollection<SyncQueueItem> get syncQueueItems => this.collection();
}

const SyncQueueItemSchema = CollectionSchema(
  name: r'SyncQueueItem',
  id: 1234567892,
  properties: {
    r'id': PropertySchema(
      id: 0,
      name: r'id',
      type: IsarType.long,
    ),
    r'recordType': PropertySchema(
      id: 1,
      name: r'recordType',
      type: IsarType.string,
    ),
    r'recordId': PropertySchema(
      id: 2,
      name: r'recordId',
      type: IsarType.long,
    ),
    r'action': PropertySchema(
      id: 3,
      name: r'action',
      type: IsarType.string,
    ),
    r'createdAt': PropertySchema(
      id: 4,
      name: r'createdAt',
      type: IsarType.dateTime,
    ),
  },
  estimateSize: _syncQueueItemEstimateSize,
  serialize: _syncQueueItemSerialize,
  deserialize: _syncQueueItemDeserialize,
  deserializeProp: _syncQueueItemDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embeddedSchemas: {},
  getId: _syncQueueItemGetId,
  getLinks: _syncQueueItemGetLinks,
  attach: _syncQueueItemAttach,
  version: '3.1.0',
);

int _syncQueueItemEstimateSize(
  SyncQueueItem object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.isNotEmpty ? offsets.last : 0;
  bytesCount += 3 + object.recordType.length * 3;
  bytesCount += 3 + object.action.length * 3;
  return bytesCount;
}

void _syncQueueItemSerialize(
  SyncQueueItem object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.id);
  writer.writeString(offsets[1], object.recordType);
  writer.writeLong(offsets[2], object.recordId);
  writer.writeString(offsets[3], object.action);
  writer.writeDateTime(offsets[4], object.createdAt);
}

SyncQueueItem _syncQueueItemDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = SyncQueueItem();
  object.id = id;
  object.recordType = reader.readString(offsets[1]);
  object.recordId = reader.readLong(offsets[2]);
  object.action = reader.readString(offsets[3]);
  object.createdAt = reader.readDateTime(offsets[4]);
  return object;
}

P _syncQueueItemDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readLong(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readLong(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readDateTime(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _syncQueueItemGetId(SyncQueueItem object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _syncQueueItemGetLinks(SyncQueueItem object) {
  return [];
}

void _syncQueueItemAttach(
    IsarCollection<dynamic> col, Id id, SyncQueueItem object) {
  object.id = id;
}

extension SyncQueueItemQueryWhereSort
    on QueryBuilder<SyncQueueItem, SyncQueueItem, QWhere> {
  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension SyncQueueItemQueryFilter
    on QueryBuilder<SyncQueueItem, SyncQueueItem, QFilterCondition> {
  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      actionEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'action',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      actionContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'action',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      actionMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'action',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      actionIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'action',
        value: '',
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      actionIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'action',
        value: '',
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      createdAtEqualTo(DateTime value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      createdAtGreaterThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      createdAtLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'createdAt',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      createdAtBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'createdAt',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordIdEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'recordId',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordIdGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'recordId',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordIdLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'recordId',
        value: value,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordIdBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'recordId',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordTypeEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'recordType',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordTypeContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'recordType',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordTypeMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'recordType',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordTypeIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'recordType',
        value: '',
      ));
    });
  }

  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      recordTypeIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'recordType',
        value: '',
      ));
    });
  }
}

extension SyncQueueItemQueryObject
    on QueryBuilder<SyncQueueItem, SyncQueueItem, QFilterCondition> {
  QueryBuilder<SyncQueueItem, SyncQueueItem, QAfterFilterCondition>
      filter(FilterQuery<SyncQueueItem> q) {
    return QueryBuilder.apply(this, (query) {
      return query.filter(q);
    });
  }
}
