// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'student_record.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, unnecessary_cast

extension GetStudentRecordCollection on Isar {
  IsarCollection<StudentRecord> get studentRecords => this.collection();
}

const StudentRecordSchema = CollectionSchema(
  name: r'StudentRecord',
  id: 1234567891,
  properties: {
    r'id': PropertySchema(
      id: 0,
      name: r'id',
      type: IsarType.long,
    ),
    r'studentId': PropertySchema(
      id: 1,
      name: r'studentId',
      type: IsarType.string,
    ),
    r'fullName': PropertySchema(
      id: 2,
      name: r'fullName',
      type: IsarType.string,
    ),
    r'course': PropertySchema(
      id: 3,
      name: r'course',
      type: IsarType.string,
    ),
    r'year': PropertySchema(
      id: 4,
      name: r'year',
      type: IsarType.long,
    ),
    r'isEligible': PropertySchema(
      id: 5,
      name: r'isEligible',
      type: IsarType.bool,
    ),
    r'syncedAt': PropertySchema(
      id: 6,
      name: r'syncedAt',
      type: IsarType.dateTime,
    ),
  },
  estimateSize: _studentRecordEstimateSize,
  serialize: _studentRecordSerialize,
  deserialize: _studentRecordDeserialize,
  deserializeProp: _studentRecordDeserializeProp,
  idName: r'id',
  indexes: {
    r'studentId': IndexSchema(
      id: 0,
      name: r'studentId',
      unique: true,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'studentId',
          type: IndexType.hash,
        )
      ],
    ),
  },
  links: {},
  embeddedSchemas: {},
  getId: _studentRecordGetId,
  getLinks: _studentRecordGetLinks,
  attach: _studentRecordAttach,
  version: '3.1.0',
);

int _studentRecordEstimateSize(
  StudentRecord object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.isNotEmpty ? offsets.last : 0;
  bytesCount += 3 + object.studentId.length * 3;
  bytesCount += 3 + object.fullName.length * 3;
  bytesCount += 3 + object.course.length * 3;
  return bytesCount;
}

void _studentRecordSerialize(
  StudentRecord object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.id);
  writer.writeString(offsets[1], object.studentId);
  writer.writeString(offsets[2], object.fullName);
  writer.writeString(offsets[3], object.course);
  writer.writeLong(offsets[4], object.year);
  writer.writeBool(offsets[5], object.isEligible);
  writer.writeDateTime(offsets[6], object.syncedAt);
}

StudentRecord _studentRecordDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = StudentRecord();
  object.id = id;
  object.studentId = reader.readString(offsets[1]);
  object.fullName = reader.readString(offsets[2]);
  object.course = reader.readString(offsets[3]);
  object.year = reader.readLong(offsets[4]);
  object.isEligible = reader.readBool(offsets[5]);
  object.syncedAt = reader.readDateTimeOrNull(offsets[6]);
  return object;
}

P _studentRecordDeserializeProp<P>(
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
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readLong(offset)) as P;
    case 5:
      return (reader.readBool(offset)) as P;
    case 6:
      return (reader.readDateTimeOrNull(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _studentRecordGetId(StudentRecord object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _studentRecordGetLinks(StudentRecord object) {
  return [];
}

void _studentRecordAttach(
    IsarCollection<dynamic> col, Id id, StudentRecord object) {
  object.id = id;
}

extension StudentRecordQueryWhereSort
    on QueryBuilder<StudentRecord, StudentRecord, QWhere> {
  QueryBuilder<StudentRecord, StudentRecord, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension StudentRecordQueryFilter
    on QueryBuilder<StudentRecord, StudentRecord, QFilterCondition> {
  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      courseEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'course',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      courseContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'course',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      courseMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'course',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      courseIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'course',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      courseIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'course',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      fullNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'fullName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      fullNameContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'fullName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      fullNameMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'fullName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      fullNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'fullName',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      fullNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'fullName',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
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

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
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

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
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

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      isEligibleEqualTo(bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isEligible',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      studentIdEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'studentId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      studentIdContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'studentId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      studentIdMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'studentId',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      studentIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'studentId',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      studentIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'studentId',
        value: '',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'syncedAt',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'syncedAt',
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtEqualTo(DateTime? value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'syncedAt',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtGreaterThan(
    DateTime? value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'syncedAt',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtLessThan(
    DateTime? value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'syncedAt',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      syncedAtBetween(
    DateTime? lower,
    DateTime? upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'syncedAt',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      yearEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'year',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      yearGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'year',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      yearLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'year',
        value: value,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      yearBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'year',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension StudentRecordQueryObject
    on QueryBuilder<StudentRecord, StudentRecord, QFilterCondition> {
  QueryBuilder<StudentRecord, StudentRecord, QAfterFilterCondition>
      filter(FilterQuery<StudentRecord> q) {
    return QueryBuilder.apply(this, (query) {
      return query.filter(q);
    });
  }
}
