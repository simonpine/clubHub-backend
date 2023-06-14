import { Router } from "express";

import { saveUser, deleteTask, getTask, getUsers, getTasksCount, updateTasks, getUsersList, getUser } from '../controllers/users'

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
 *      summary: Save a new task
 */
router.post('/users', saveUser)
// /**
//  * @swagger
//  * /task/:id:
//  *  delete:
//  *      summary: Delete a task by id
//  */
// router.delete('/task/:id', deleteTask)
// /**
//  * @swagger
//  * /task/:id:
//  *  put:
//  *      summary: Update a task by id
//  */
// router.put('/task/:id', updateTasks)


export default router