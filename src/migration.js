exports.up = knex => {
  return Promise.resolve().then(createUsersTable);

  function createUsersTable() {
    return knex.schema.createTable("users", table => {
      table
        .increments("id")
        .primary()
        .unsigned();
      table.string("firstname");
      table.string("lastname");
      table.string("email").unique();
      table.string("password");
      table.timestamps(false, true);
    });
  }
};

exports.down = knex => {
  return Promise.resolve().then(dropUsersTable);

  function dropUsersTable() {
    return knex.schema.dropTable("users");
  }
};
