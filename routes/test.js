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
*           courseid: 123
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
        logger.debug(`[test router][router.get all] `)
        const test = await test_repo.get_all_test();
        console.log(test);
        resp.status(200).json({ test })
    }
    catch (err) {
        logger.error(`error during GET ALL in test router. test = ${JSON.stringify(test)} ${err.message}`)
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
        logger.debug(`[test router][router.get_test_by_id] parameter :id = ${req.params.id}`)
        const test = await test_repo.get_test_by_id(req.params.id)
        resp.status(200).json(test)
    }
    catch (err) {
        logger.error(`[test router][router.get by id]  id =  ${req.params.id} ${err}`)
        resp.status(500).json({ "error": err.message })
    }
})



/**
* 
* @swagger
* /test/:
*     post:
*       summary: Creates a new test
*       tags: [test]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/test'
*       responses:
*         "200":
*           description: The created test.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*/

router.post("/",async function (req, res) {
    logger.debug(`[test router][router.post] req.body = ${JSON.stringify(req.body)} `)
    console.log(req.body);
	const { name, courseid } = req.body;
    try {
        let test = {
            name,
            date: new Date(),
            courseid: courseid
        };
        await test_repo.insert_test(test)
        //test1.push(test);
        logger.debug(`[test router][router.post] req.body = ${JSON.stringify(test)} `)
        res.status(201).json(test);
    }
    catch(err){
        console.log(err);
        logger.error(`error during POST in test router. test = ${JSON.stringify(test)} + ${err.message}`)
        resp.status(500).json({ "error": err.message })
    }
});






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

router.put("/:id", async function (req, res) {
	const test = await test_repo.get_test_by_id(req.params.id)
	if (test) {
        logger.debug(`[test router][router.put] parameter :id = ${req.params.id} test = ${test}`)
		const { name, courseid } = req.body;

		let updated = {
			name: name == undefined ? test.name : name,
            courseid: courseid == undefined ? test.courseid : courseid,
			updatedat: new Date(),
		};
    await test_repo.update_test(req.params.id, updated);
		res.sendStatus(204);
	} 
    else {
        logger.error(`error during PUT in test router. id = ${req.params.id} + ${err.message}`)
		res.sendStatus(404);
	} 
}); 


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
        logger.info(`[test router][router.delete] parameter :id = ${req.params.id}`)
        const result = await connectedKnex('test').where('id', req.params.id).del()
        resp.status(200).json({
            status: 'success',
            "how many deleted": result
        })
    }
    catch (err) {
        logger.error(`error during DELETE in test router.id = ${req.params.id} + ${err.message}`)
        resp.status(500).json({ "error": err.message })
    }

})

// /**
//  * @swagger
//  * /test/{id}:
//  *  patch:
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

// // PATCH -- UPDATE 
// router.patch('/:id', (req, resp) => {
//     console.log(req.params.id);
//     // actually delete ... later
//     // response
//     resp.writeHead(200)
//     resp.end('Successfully updated patched')
// })


module.exports = router;
