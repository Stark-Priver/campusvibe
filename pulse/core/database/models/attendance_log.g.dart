// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_log.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, unnecessary_cast

extension GetAttendanceLogCollection on Isar {
  IsarCollection<AttendanceLog> get attendanceLogs => this.collection();
}

const AttendanceLogSchema = CollectionSchema(
  name: r'AttendanceLog',
  id: 1234567890,
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
    r'sessionId': PropertySchema(
      id: 2,
      name: r'sessionId',
      type: IsarType.string,
    ),
    r'sessionType': PropertySchema(
      id: 3,
      name: r'sessionType',
      type: IsarType.string,
    ),
    r'timestamp': PropertySchema(
      id: 4,
      name: r'timestamp',
      type: IsarType.dateTime,
    ),
    r'isSynced': PropertySchema(
      id: 5,
      name: r'isSynced',
      type: IsarType.bool,
    ),
  },
  estimateSize: _attendanceLogEstimateSize,
  serialize: _attendanceLogSerialize,
  deserialize: _attendanceLogDeserialize,
  deserializeProp: _attendanceLogDeserializeProp,
  idName: r'id',
  indexes: {
    r'studentId': IndexSchema(
      id: 0,
      name: r'studentId',
      unique: false,
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
  getId: _attendanceLogGetId,
  getLinks: _attendanceLogGetLinks,
  attach: _attendanceLogAttach,
  version: '3.1.0',
);

int _attendanceLogEstimateSize(
  AttendanceLog object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.isNotEmpty ? offsets.last : 0;
  bytesCount += 3 + object.studentId.length * 3;
  bytesCount += 3 + object.sessionId.length * 3;
  bytesCount += 3 + object.sessionType.length * 3;
  return bytesCount;
}

void _attendanceLogSerialize(
  AttendanceLog object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.id);
  writer.writeString(offsets[1], object.studentId);
  writer.writeString(offsets[2], object.sessionId);
  writer.writeString(offsets[3], object.sessionType);
  writer.writeDateTime(offsets[4], object.timestamp);
  writer.writeBool(offsets[5], object.isSynced);
}

AttendanceLog _attendanceLogDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = AttendanceLog();
  object.id = id;
  object.studentId = reader.readString(offsets[1]);
  object.sessionId = reader.readString(offsets[2]);
  object.sessionType = reader.readString(offsets[3]);
  object.timestamp = reader.readDateTime(offsets[4]);
  object.isSynced = reader.readBool(offsets[5]);
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
      return (reader.readLong(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readDateTime(offset)) as P;
    case 5:
      return (reader.readBool(offset)) as P;
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

extension AttendanceLogQueryFilter
    on QueryBuilder<AttendanceLog, AttendanceLog, QFilterCondition> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
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

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
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

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
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
      sessionIdEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sessionId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionIdContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'sessionId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionIdMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'sessionId',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sessionId',
        value: '',
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'sessionId',
        value: '',
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionTypeEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sessionType',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionTypeContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'sessionType',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionTypeMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'sessionType',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionTypeIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sessionType',
        value: '',
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      sessionTypeIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'sessionType',
        value: '',
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

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      studentIdContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'studentId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      studentIdMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'studentId',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      studentIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'studentId',
        value: '',
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      studentIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'studentId',
        value: '',
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      timestampEqualTo(DateTime value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'timestamp',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      timestampGreaterThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'timestamp',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      timestampLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'timestamp',
        value: value,
      ));
    });
  }

  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      timestampBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'timestamp',
        lower: lower,
        upper: upper,
        includeLower: includeLower,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension AttendanceLogQueryObject
    on QueryBuilder<AttendanceLog, AttendanceLog, QFilterCondition> {
  QueryBuilder<AttendanceLog, AttendanceLog, QAfterFilterCondition>
      filter(FilterQuery<AttendanceLog> q) {
    return QueryBuilder.apply(this, (query) {
      return query.filter(q);
    });
  }
}
