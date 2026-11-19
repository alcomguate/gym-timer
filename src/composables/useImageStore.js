const DB_NAME = 'gym-images'
const DB_STORE = 'images'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = e => e.target.result.createObjectStore(DB_STORE, { keyPath: 'id' })
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

function compressImage(file, maxSide = 1200, quality = 0.78) {
  return new Promise(resolve => {
    const img = new Image()
    const src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(src)
      let { width, height } = img
      if (width > maxSide || height > maxSide) {
        if (width > height) { height = Math.round(height * maxSide / width); width = maxSide }
        else                { width = Math.round(width * maxSide / height); height = maxSide }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    img.src = src
  })
}

export async function saveImage(file) {
  const blob = await compressImage(file)
  const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const db = await openDB()
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    tx.objectStore(DB_STORE).put({ id, blob })
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
  return id
}

export async function getImageUrl(id) {
  const db = await openDB()
  const record = await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly')
    const req = tx.objectStore(DB_STORE).get(id)
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
  return record ? URL.createObjectURL(record.blob) : null
}

export async function deleteImage(id) {
  const db = await openDB()
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    tx.objectStore(DB_STORE).delete(id)
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
}
