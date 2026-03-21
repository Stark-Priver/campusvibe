// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_log.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, typedef_fn_without_return_statement, invalid_use_of_visible_for_testing_member, avoid_dynamic_calls, no_leading_underscores_for_local_identifiers

extension GetAttendanceLogCollection on Isar {
  IsarCollection<AttendanceLog> get attendanceLogs =>
      this.collection();
}

const AttendanceLogSchema = CollectionSchema(
  name: r'AttendanceLog',
  id: 2983402729875631845,
  properties: {
    r'isEligible': PropertySchema(
      id: 0,
      name: r'isEligible',
      type: IsarType.bool,
    ),
    r'isSynced': PropertySchema(
      id: 1,
      name: r'isSynced',
      type: IsarType.bool,
    ),
    r'localId': PropertySchema(
      id: 2,
      name: r'localId',
      type: IsarType.string,
    ),
    r'sessionId': PropertySchema(
      id: 3,
      name: r'sessionId',
      type: IsarType.string,
    ),
    r'sessionName': PropertySchema(
      id: 4,
      name: r'sessionName',
      type: IsarType.string,
    ),
    r'sessionType': PropertySchema(
      id: 5,
      name: r'sessionType',
      type: IsarType.string,
    ),
    r'studentId': PropertySchema(
      id: 6,
      name: r'studentId',
      type: IsarType.string,
    ),
    r'studentName': PropertySchema(
      id: 7,
      name: r'studentName',
      type: IsarType.string,
    ),
    r'timestamp': PropertySchema(
      id: 8,
      name: r'timestamp',
      type: IsarType.dateTime,
    )
  },
  estimateSize: _attendanceLogEstimateSize,
  serialize: _attendanceLogSerialize,
  deserialize: _attendanceLogDeserialize,
  deserializeProp: _attendanceLogDeserializeProp,
  idName: r'id',
  indexes: {
    r'studentId': IndexSchema(
      id: 1681759726889611357,
      name: r'studentId',
      unique: false,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'studentId',
          type: IndexType.hash,
          caseSensitive: true,
        )
      ],
    ),
    r'localId': IndexSchema(
      id: 7463903368643665804,
      name: r'localId',
      unique: true,
      replace: true,
      properties: [
        IndexPropertySchema(
          name: r'localId',
          type: IndexType.hash,
          caseSensitive: true,
        )
      ],
    ),
    r'timestamp': IndexSchema(
      id: 1155772489580413780,
      name: r'timestamp',
      unique: false,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'timestamp',
          type: IndexType.value,
          caseSensitive: false,
        )
      ],
    )
  },
  links: {},
  embeddedSchemas: {},
  getId: _attendanceLogGetId,
  getLinks: _attendanceLogGetLinks,
  attach: _attendanceLogAttach,
  version: '3.1.0+1',
);

int _attendanceLogEstimateSize(
  AttendanceLog object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.localId.length * 3;
  bytesCount += 3 + object.sessionId.length * 3;
  bytesCount += 3 + object.sessionName.length * 3;
  bytesCount += 3 + object.sessionType.length * 3;
  bytesCount += 3 + object.studentId.length * 3;
  bytesCount += 3 + object.studentName.length * 3;
  return bytesCount;
}

void _attendanceLogSerialize(
  AttendanceLog object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeBool(offsets[0], object.isEligible);
  writer.writeBool(offsets[1], object.isSynced);
  writer.writeString(offsets[2], object.localId);
  writer.writeString(offsets[3], object.sessionId);
  writer.writeString(offsets[4], object.sessionName);
  writer.writeString(offsets[5], object.sessionType);
  writer.writeString(offsets[6], object.studentId);
  writer.writeString(offsets[7], object.studentName);
  writer.writeDateTime(offsets[8], object.timestamp);
}

AttendanceLog _attendanceLogDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = AttendanceLog();
  object.id = id;
  object.isEligible = reader.readBool(offsets[0]);
  object.isSynced = reader.readBool(offsets[1]);
  object.localId = reader.readString(offsets[2]);
  object.sessionId = reader.readString(offsets[3]);
  object.sessionName = reader.readString(offsets[4]);
  object.sessionType = reader.readString(offsets[5]);
  object.studentId = reader.readString(offsets[6]);
  object.studentName = reader.readString(offsets[7]);
  object.timestamp = reader.readDateTime(offsets[8]);
  return object;
}

P _attendanceLogDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readBool(offset)) as P;
    case 1:
      return (reader.readBool(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readString(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    case 6:
      return (reader.readString(offset)) as P;
    case 7:
      return (reader.readString(offset)) as P;
    case 8:
      return (reader.readDateTime(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _attendanceLogGetId(AttendanceLog object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _attendanceLogGetLinks(AttendanceLog object) {
  return [];
}

void _attendanceLogAttach(
    IsarCollection<dynamic> col, Id id, AttendanceLog object) {
  object.id = id;
}

extension AttendanceLogQueryWhereSort
    on QueryBuilder<AttendanceLog, AttendanceLog, QWhere> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension AttendanceLogQueryWhere
    on QueryBuilder<AttendanceLog, AttendanceLog, QWhereClause> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterWhereClause> idEqualTo(
      Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }
}

extension AttendanceLogQueryFilter
    on QueryBuilder<AttendanceLog, AttendanceLog, QFilterCondition> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      isSyncedEqualTo(bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isSynced',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      isEligibleEqualTo(bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isEligible',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
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

extension AttendanceLogQuerySortBy
    on QueryBuilder<AttendanceLog, AttendanceLog, QSortBy> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterSortBy>
      sortByTimestampDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'timestamp', Sort.desc);
    });
  }
}

extension AttendanceLogQuerySortThenBy
    on QueryBuilder<AttendanceLog, AttendanceLog, QSortThenBy> {}

extension AttendanceLogQueryWhereDistinct
    on QueryBuilder<AttendanceLog, AttendanceLog, QDistinct> {}


