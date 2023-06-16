import { Router } from "express";

import { saveUser, deleteUser, getTask, getUsers, getTasksCount, updateUser, getUsersList, getUser, getUserName } from '../controllers/users'

const router = Router()

/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all users
 */
router.get('/users', getUsers)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all usersNames
 */
router.get('/users/list', getUsersList)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all usersNames
 */
router.get('/user/:id', getUser)
/**
 * @swagger
 * /tasks:
 *  get:
 *      summary: Get all usersNames
 */
router.get('/userName/:id', getUserName)
// /**
//  * @swagger
//  * /tasks/count:
//  *  get:
//  *      summary: Get all task counter
//  */
// router.get('/tasks/count', getTasksCount)
// /**
//  * @swagger
//  * /task/:id:
//  *  get:
//  *      summary: Get a task by id
//  */
// router.get('/task/:id', getTask)
/**
 * @swagger
 * /tasks:
 *  post:
 *      summary: Create a new user
 */
router.post('/users', saveUser)
/**
 * @swagger
 * /task/:id:
 *  delete:
 *      summary: Delete a user by name
 */
router.delete('/users/:id', deleteUser)
/**
 * @swagger
 * /task/:id:
 *  put:
 *      summary: Update a task by id
 */
router.put('/user/:id', updateUser)


export default router