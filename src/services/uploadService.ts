import { apiClient } from './apiClient'
import { useAssets } from '@/stores/assets'
import axios from 'axios'

const PART_SIZE = 5 * 1024 * 1024
const INITIAL_CONCURRENCY = 2
const MIN_CONCURRENCY = 1
const MAX_CONCURRENCY = 10
const ADJUST_EVERY_N = 2

export interface UploadCallbacks {
  onProgress: (percent: number) => void
  onConcurrencyChange: (concurrency: number) => void
}

export async function uploadAsset(
  file: File,
  name: string,
  parentAssetId: number | null,
  callbacks: UploadCallbacks,
): Promise<void> {
  const assetsStore = useAssets()

  const newAsset = await assetsStore.createAsset({ name, folder: false, filename: file.name, parentAssetId })
  await assetsStore.loadAssets()

  const { id, uploadId, key } = newAsset.data
  const totalParts = Math.ceil(file.size / PART_SIZE)
  const parts: { PartNumber: number; ETag: string }[] = new Array(totalParts)

  let concurrency = INITIAL_CONCURRENCY
  callbacks.onConcurrencyChange(concurrency)

  const speedSamples: number[] = []

  function adjustConcurrency() {
    if (speedSamples.length < 4) return
    const recent = (speedSamples[speedSamples.length - 1] + speedSamples[speedSamples.length - 2]) / 2
    const older = (speedSamples[speedSamples.length - 3] + speedSamples[speedSamples.length - 4]) / 2
    if (recent > older * 1.1 && concurrency < MAX_CONCURRENCY) {
      concurrency++
    } else if (recent < older * 0.8 && concurrency > MIN_CONCURRENCY) {
      concurrency--
    }
    callbacks.onConcurrencyChange(concurrency)
  }

  async function uploadOnePart(partNumber: number): Promise<void> {
    const start = (partNumber - 1) * PART_SIZE
    const end = Math.min(start + PART_SIZE, file.size)
    const chunk = file.slice(start, end)

    const { data } = await apiClient.get('/media/multipart/presign', {
      params: { key, uploadId, partNumber },
    })
    const url = data.data.url

    const t0 = Date.now()
    const response = await axios.put(url, chunk, {
      headers: { 'Content-Type': 'application/octet-stream' },
    })
    const dt = Math.max(Date.now() - t0, 1)

    speedSamples.push(chunk.size / dt)
    if (speedSamples.length > 8) speedSamples.shift()

    parts[partNumber - 1] = { PartNumber: partNumber, ETag: response.headers['etag'] }
  }

  try {
    let nextPart = 1
    let completedCount = 0
    let adjustmentCount = 0

    await new Promise<void>((resolve, reject) => {
      let activeCount = 0
      let failed = false

      function tryStartNext() {
        while (activeCount < concurrency && nextPart <= totalParts && !failed) {
          const pn = nextPart++
          activeCount++

          uploadOnePart(pn)
            .then(() => {
              activeCount--
              completedCount++
              callbacks.onProgress(Math.round((completedCount / totalParts) * 100))

              adjustmentCount++
              if (adjustmentCount % ADJUST_EVERY_N === 0) adjustConcurrency()

              if (completedCount === totalParts) resolve()
              else tryStartNext()
            })
            .catch((err) => {
              if (!failed) {
                failed = true
                reject(err)
              }
            })
        }
      }

      tryStartNext()
    })

    await apiClient.post('/media/multipart/complete', { key, uploadId, parts })
    await assetsStore.patchAssetStatus(id, 'success')
  } catch (error) {
    await apiClient.post('/media/multipart/abort', { key, uploadId }).catch(() => {})
    throw error
  } finally {
    await assetsStore.loadAssets()
  }
}
