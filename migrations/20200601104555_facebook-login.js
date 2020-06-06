exports.up = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.string("facebookID");
        table.string("accessToken");
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("facebookID");
        table.dropColumn("accessToken");
    });
};
