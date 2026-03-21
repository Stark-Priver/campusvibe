// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'student_record.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, typedef_fn_without_return_statement, invalid_use_of_visible_for_testing_member, avoid_dynamic_calls, no_leading_underscores_for_local_identifiers

extension GetStudentRecordCollection on Isar {
  IsarCollection<StudentRecord> get studentRecords =>
      this.collection();
}

const StudentRecordSchema = CollectionSchema(
  name: r'StudentRecord',
  id: 5543498882799534578,
  properties: {
    r'course': PropertySchema(
      id: 0,
      name: r'course',
      type: IsarType.string,
    ),
    r'fullName': PropertySchema(
      id: 1,
      name: r'fullName',
      type: IsarType.string,
    ),
    r'isEligible': PropertySchema(
      id: 2,
      name: r'isEligible',
      type: IsarType.bool,
    ),
    r'studentId': PropertySchema(
      id: 3,
      name: r'studentId',
      type: IsarType.string,
    ),
    r'syncedAt': PropertySchema(
      id: 4,
      name: r'syncedAt',
      type: IsarType.dateTime,
    ),
    r'year': PropertySchema(
      id: 5,
      name: r'year',
      type: IsarType.long,
    )
  },
  estimateSize: _studentRecordEstimateSize,
  serialize: _studentRecordSerialize,
  deserialize: _studentRecordDeserialize,
  deserializeProp: _studentRecordDeserializeProp,
  idName: r'id',
  indexes: {
    r'studentId': IndexSchema(
      id: 1681759726889611357,
      name: r'studentId',
      unique: true,
      replace: true,
      properties: [
        IndexPropertySchema(
          name: r'studentId',
          type: IndexType.hash,
          caseSensitive: true,
        )
      ],
    )
  },
  links: {},
  embeddedSchemas: {},
  getId: _studentRecordGetId,
  getLinks: _studentRecordGetLinks,
  attach: _studentRecordAttach,
  version: '3.1.0+1',
);

int _studentRecordEstimateSize(
  StudentRecord object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.course.length * 3;
  bytesCount += 3 + object.fullName.length * 3;
  bytesCount += 3 + object.studentId.length * 3;
  return bytesCount;
}

void _studentRecordSerialize(
  StudentRecord object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.course);
  writer.writeString(offsets[1], object.fullName);
  writer.writeBool(offsets[2], object.isEligible);
  writer.writeString(offsets[3], object.studentId);
  writer.writeDateTime(offsets[4], object.syncedAt);
  writer.writeLong(offsets[5], object.year);
}

StudentRecord _studentRecordDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = StudentRecord();
  object.course = reader.readString(offsets[0]);
  object.fullName = reader.readString(offsets[1]);
  object.id = id;
  object.isEligible = reader.readBool(offsets[2]);
  object.studentId = reader.readString(offsets[3]);
  object.syncedAt = reader.readDateTimeOrNull(offsets[4]);
  object.year = reader.readLong(offsets[5]);
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
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readBool(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readDateTimeOrNull(offset)) as P;
    case 5:
      return (reader.readLong(offset)) as P;
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

extension StudentRecordQueryWhere
    on QueryBuilder<StudentRecord, StudentRecord, QWhereClause> {
  QueryBuilder<StudentRecord, StudentRecord, QAfterWhereClause> idEqualTo(
      Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<StudentRecord, StudentRecord, QAfterWhereClause>
      studentIdEqualTo(String studentId) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.equalTo(
        indexName: r'studentId',
        value: [studentId],
      ));
    });
  }
}

extension StudentRecordQueryFilter
    on QueryBuilder<StudentRecord, StudentRecord, QFilterCondition> {
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
}

extension StudentRecordQuerySortBy
    on QueryBuilder<StudentRecord, StudentRecord, QSortBy> {}

extension StudentRecordQuerySortThenBy
    on QueryBuilder<StudentRecord, StudentRecord, QSortThenBy> {}

extension StudentRecordQueryWhereDistinct
    on QueryBuilder<StudentRecord, StudentRecord, QDistinct> {}

