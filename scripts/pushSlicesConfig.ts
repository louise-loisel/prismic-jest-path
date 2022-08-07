/* eslint-disable no-console -- log results to follow deployment */
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)

const PRISMIC_API_URL = `https://customtypes.prismic.io`
const PRISMIC_HEADERS = {
  repository: process.env.PRISMIC_REPOSITORY ?? '',
  Authorization: `Bearer ${process.env.CUSTOM_TYPES_API_KEY}`,
}

interface Slice {
  id: string
}

const getFiles = async (directoryPath: string): Promise<string[]> => {
  const subDirs = await readdir(directoryPath)
  const files = await Promise.all(
    subDirs.map(async (subdir) => {
      const res = path.resolve(directoryPath, subdir)
      return (await stat(res)).isDirectory() ? getFiles(res) : [res]
    })
  )
  return files.reduce((a, f) => a.concat(f), [])
}
const fetchSlices = async (): Promise<Slice[]> => {
  const response = await fetch(`${PRISMIC_API_URL}/slices`, {
    headers: PRISMIC_HEADERS,
  })
  return (await response.json()) as Slice[]
}

const updateSlice = async (updatedSlice: Slice) => {
  await fetch(`${PRISMIC_API_URL}/slices/update`, {
    method: 'POST',
    headers: PRISMIC_HEADERS,
    body: JSON.stringify(updatedSlice),
  })
}

const createSlice = async (createdSlice: Slice) => {
  await fetch(`${PRISMIC_API_URL}/slices/insert`, {
    method: 'POST',
    headers: PRISMIC_HEADERS,
    body: JSON.stringify(createdSlice),
  })
}

const deleteSlice = async (deletedSliceId: string) => {
  await fetch(`${PRISMIC_API_URL}/slices/${deletedSliceId}`, {
    method: 'DELETE',
    headers: PRISMIC_HEADERS,
  })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const executeScript = async () => {
  const directoryPath = path.join(__dirname, '../slices')
  const files = (await getFiles(directoryPath)).filter((filename) =>
    filename.includes('model.json')
  )
  // 1. Read config
  const newSlices = files.reduce((slices, fileName) => {
    const slice = JSON.parse(fs.readFileSync(fileName, 'utf8')) as Slice
    slices[slice.id] = slice
    return slices
  }, {} as Record<string, Slice>)

  // 2. fetch current slices config
  const oldSlices = (await fetchSlices()).reduce((slices, slice) => {
    slices[slice.id] = slice
    return slices
  }, {} as Record<string, Slice>)

  const newSlicesIds = Object.keys(newSlices)
  const oldSlicesIds = Object.keys(oldSlices)

  await Promise.all(
    newSlicesIds.map(async (id) => {
      const oldSliceIdIndex = oldSlicesIds.findIndex(
        (oldSliceId) => oldSliceId === id
      )
      if (oldSliceIdIndex >= 0) {
        // update
        console.log(`Updating slice ${id}`)
        await updateSlice(newSlices[id])
        // remove id from oldSlicesIds
        oldSlicesIds.splice(oldSliceIdIndex, oldSliceIdIndex + 1)
        return
      }
      // create
      console.log(`Creating slice ${id}`)
      createSlice(newSlices[id])
    })
  )
  await Promise.all(
    oldSlicesIds.map(async (id) => {
      console.log(`Deleting slice ${id}`)
      await deleteSlice(id)
    })
  )
}
executeScript()
