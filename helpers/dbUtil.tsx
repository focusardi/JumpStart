//import React from 'react';
import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {name: 'my.db', location: 'default'},
  () => {},
  (error) => {
    console.log('ERROR: ' + error);
  },
);

export const ExecuteQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        },
      );
    });
  });
