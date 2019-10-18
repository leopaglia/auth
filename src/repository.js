const tableName = "users";

module.exports = db => {
  return {
    create,
    findById,
    findOne,
    update,
    remove
  };

  function findOne(filters, { withPrivateFields } = {}) {
    return db
      .select()
      .from(tableName)
      .where(filters)
      .first()
      .then(user => {
        if (!withPrivateFields) return removePrivateFields(user);
        else return user;
      });
  }

  function findById(id, columns) {
    return findOne({ id }, columns);
  }

  function create(fields) {
    return db
      .insert(fields)
      .into(tableName)
      .returning("*")
      .then(r => r[0])
      .then(removePrivateFields);
  }

  function update(id, fields, returning = "*") {
    return db(tableName)
      .where({ id })
      .update({ ...fields, updated_at: new Date() })
      .returning(returning)
      .then(r => r[0])
      .then(removePrivateFields);
  }

  function remove(id) {
    return db(tableName)
      .where({ id })
      .del();
  }

  function removePrivateFields(userData) {
    if (userData) {
      const { password, ...publicFields } = userData;
      return { ...publicFields };
    }

    return userData;
  }
};
