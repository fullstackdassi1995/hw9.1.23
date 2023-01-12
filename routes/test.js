const express = require('express')
const router = express.Router()
const knex = require('knex')
const config = require('config')
const test_repo = require('../dal/test_repo')
const logger = require('../logger/my_logger')
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


/**
*  @swagger
*  components:
*     schemas:
*       test:
*         type: object
*         required:
*           - id
*           - updatedat
*           - name
*           - courseid
*         properties:
*           id:
*             type: integer
*             description: The auto-generated id of the test.
*           updatedat:
*             type: object
*             description: The updated date of the test.
*           name:
*             type: string
*             description: the name of the test.
*           date:
*             type: object
*             description: The date of the test.
*           courseid:
*             type: int
*             description: course id of the test.
*         example:
*           updatedat: new date()
*           name: Kim
*           date: new date()
*           coursid: 123
*/

/**
*  @swagger
*  tags:
*    name: test
*    description: API to manage your test.
*/


/**
*  @swagger
*   /test/:
*     get:
*       summary: List all of the test
*       tags: [test]
*       responses:
*         "200":
*           description: The list of test.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*/

router.get('/', async (req, resp) => {
    try {
        const test = await test_repo.get_all_test();
        console.log(test);
        resp.status(200).json({ test })
    }
    catch (err) {
        resp.status(500).json({ "error": err.message })
    }
})

/**
*  @swagger
*  /test/{id}:
*    get:
*      summary: Gets a test by id
*      operationId: getUser
*      parameters:
*        - in: path
*          name: id
*          required: true
*          schema:
*            type: integer
*            format: int64
*      responses:
*        '200':
*          description: A id test
*          content:
*           application/json:
*              schema:
*                $ref: '#/components/schemas/test'
*
*/
          
router.get('/:id', async (req, resp) => {
    try {
        const test = await test_repo.get_test_by_id(req.params.id)
        resp.status(200).json(test)
    }
    catch (err) {
        resp.status(500).json({ "error": err.message })
    }
})

function is_valid_test(obj) {
    return  obj.hasOwnProperty('name') && 
        obj.hasOwnProperty('courseid') 
}

/**
*  @swagger
*	/test/{id}:
*     put:
*       summary: Updates a test
*       tags: [test]
*       parameters:
*         - in: path
*           name: id
*           schema:
*             type: integer
*           required: true
*           description: The test id
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/test'
*       responses:
*         "204":
*           description: Update was successful.
*         "404":
*           description: test not found.
*/

router.put("/:id", function (req, res) {
	let test = test_repo.find(function (item) {
		return item.id == req.params.id;
	});

	if (test) {
		const {  name, courseid } = req.body;

		let updated = {
			id: test.id,
			name: name !== undefined ? name : test.name,
            courseid: courseid !== undefined ? courseid : test.courseid,
			createdat: new Date(),
		};

		test_repo.insert_test.splice(test_repo.indexOf(test), 1, updated);

		res.sendStatus(204);
	} else {
		res.sendStatus(404);
	}
});

// /**
// * 
// * @swagger
// * /test/:
// *     post:
// *       summary: Creates a new test
// *       tags: [test]
// *       requestBody:
// *         required: true
// *         content:
// *           application/json:
// *             schema:
// *               $ref: '#/components/schemas/test'
// *       responses:
// *         "200":
// *           description: The created test.
// *           content:
// *             application/json:
// *               schema:
// *                 $ref: '#/components/schemas/test'
// */

// router.post("/", function (req, res) {
// 	const { name, date, courseid } = req.body;

// 	let test = {
// 		name: name,
// 		date: new Date(),
//         courseid: courseid
// 	};
// 	test_repo.push(test);

// 	res.status(201).json(test);
// });


// /**
//  * @swagger
//  * /test/{id}:
//  *  put:
//  *      description: Patch test
//  *      parameters:
//  *        - in: path
//  *          name: id
//  *          schema:
//  *              type: string
//  *          required: true
//  *          description: string id of user to delete
//  *      responses:
//  *          200:
//  *              description: User that was deleted
//  */



// // PUT -- UPDATE/replace (or insert)
// router.put('/:id', async (req, resp) => {
//     console.log(req.body);
//     const employee = req.body
//     try {
//         if (! is_valid_test (employee)) {
//             resp.status(400).json({ error: 'values of employee are not llegal'})
//             return
//         }
//         const result = await emp_repo.update_emp(req.params.id, employee)
//         resp.status(200).json({
//              status: 'updated',
//              'how many rows updated': result
//             })
//     }
//     catch (err) {
//         resp.status(500).json({ "error": err.message })
//     }
// })


/**
 * @swagger
 * /test/{id}:
 *  delete:
 *      description: Delete test
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of user to delete
 *      responses:
 *          200:
 *              description: User that was deleted
 */


// DELETE 
// router.delete('/:id', function(req, res, next) {
//     var { id } = req.params;
//     // TODO: Delete user with given id
//     return res.json({id: id});
//   });


router.delete('/:id', async (req, resp) => {
    try {
        const result = await connectedKnex('test').where('id', req.params.id).del()
        resp.status(200).json({
            status: 'success',
            "how many deleted": result
        })
    }
    catch (err) {
        resp.status(500).json({ "error": err.message })
    }

})

/**
 * @swagger
 * /test/{id}:
 *  patch:
 *      description: Patch test
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of user to delete
 *      responses:
 *          200:
 *              description: User that was deleted
 */

// PATCH -- UPDATE 
router.patch('/:id', (req, resp) => {
    console.log(req.params.id);
    // actually delete ... later
    // response
    resp.writeHead(200)
    resp.end('Successfully updated patched')
})


module.exports = router;
