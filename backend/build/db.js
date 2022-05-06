"use strict";
var MySql = require('sync-mysql');
const { config } = require('./config');
var connection = new MySql({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
;
const init_mysql = () => {
};
const addq = (data) => {
    return "'" + data + "'";
};
const addqc = (data) => {
    return "`" + data + "`";
};
const get_insert_sql = (data, table) => {
    let columns = '';
    let values = '';
    Object.keys(data).map((key) => {
        columns = columns + (columns === '' ? addqc(key) : ',' + addqc(key));
        values = values + (values === '' ? addq(data[key]) : ',' + addq(data[key]));
    });
    const sqlquery = `INSERT INTO \`${table}\` (${columns}) VALUES (${values})`;
    return (sqlquery);
};
const get_update_sql = (id, data, table, idfield = 'id') => {
    let values = '';
    Object.keys(data).map((key) => {
        if (key != idfield) {
            const f = addqc(key) + "=" + addq(data[key]);
            values = values + (values === '' ? f : ',' + f);
        }
    });
    const sqlquery = `UPDATE  ${table} set ${values} where ${idfield}='${id}'`;
    return (sqlquery);
};
const insert_record = (table, data) => {
    const sqlquery = get_insert_sql(data, table);
    const result = connection.query(sqlquery);
    return (result);
};
const update_record = (table, id, data, idfield = 'id') => {
    const sqlquery = get_update_sql(id, data, table, idfield);
    const result = connection.query(sqlquery);
    return (result);
};
const get_records = (sql) => {
    const result = connection.query(sql);
    return (result);
};
module.exports = {
    insert_record: insert_record,
    update_record: update_record,
    get_records: get_records,
    init_mysql: init_mysql
};
