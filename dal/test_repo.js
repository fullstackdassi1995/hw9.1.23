const knex = require('knex')
const config = require('config')

const connectedKnex = knex({
    client: 'pg',
    version: config.db.version,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }
})

const get_all_test = () => {
    return connectedKnex('test').select('*');
}

const get_test_by_id = id => {
    return connectedKnex('test').select('*').where('id', id).first()
}

const insert_test = test => {
    return connectedKnex('test').insert(test)
}

const update_test = (id, test) => {
    return connectedKnex('test').where('id', id).update(test)
}

const del_test_by_id = (id) => {
    return connectedKnex('test').where('id', id).del()
}

module.exports = {
    get_all_test,
    get_test_by_id,
    insert_test,
    update_test, 
    del_test_by_id
}