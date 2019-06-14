var db = require('../../config/db');

module.exports = {
  getHomePage: (req, res) => {
    // let query = "SELECT * FROM `reservations` ORDER BY id ASC";
    let query = 'SELECT * FROM `reservations`  ';

    let teachersQuery = 'SELECT * FROM `teachers` ORDER BY id ASC';
    let groupsQuery = 'SELECT * FROM `groups` ORDER BY id ASC';
    // var teacher = req.query.teacher;
    var teacher = req.query.teacher;
    var stage = req.query.stage;
    var year = req.query.year;
    var group = req.query.group;
    var type = req.query.type;
    var confirm = req.query.confirm;
    var nameToSearch = req.query.nameToSearch;

    if (teacher !== null && teacher !== undefined && teacher !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`Teacher_name` = '" + teacher + "' AND ";
    }

    if (stage !== null && stage !== undefined && stage !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`Stage` = '" + stage + "' AND ";
    }

    if (year !== null && year !== undefined && year !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`year` = '" + year + "' AND ";
    }

    if (group !== null && group !== undefined && group !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`Group` = '" + group + "' AND ";
    }

    if (type !== null && type !== undefined && type !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`type` = '" + type + "' AND ";
    }

    if (confirm !== null && confirm !== undefined && confirm !== '') {
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      if (confirm === 'لم يتم تأكيد الحجز')
        query += '`confirm` = ' + 0 + ' AND ';
      else query += '`confirm` = ' + 1 + ' AND ';
    }
    if (
      nameToSearch !== null &&
      nameToSearch !== undefined &&
      nameToSearch !== ''
    ) {
      nameToSearch = nameToSearch.trim();
      let ind = query.indexOf('where');
      if (ind === -1) {
        query += ' where ';
      }
      query += "`student_name` LIKE'%" + nameToSearch + "%' AND ";
    }

    query = query.slice(0, -1);
    if (query.slice(-1) === 'D') {
      query = query.slice(0, -3);
    }

    query += ' ORDER BY id ASC';

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect('/');
      }
      db.query(teachersQuery, (err, result2) => {
        if (err) {
          res.redirect('/');
        }

        db.query(groupsQuery, (err, result3) => {
          if (err) {
            res.redirect('/');
          }
          let year = getUnique(result, 'year');
          result['year'] = year;
          res.render('profile.ejs', {
            title: 'Welcome to Fnoon',
            reservations: result,
            teachers: result2,
            groups: result3,
          });
        });
      });
    });
  },
};

var getUnique = function(arr, comp) {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};
