const { MongoClient, Logger } = require('mongodb')
const cacheManager = require('cache-manager')

class Database {
  constructor() {
    this.ready = null
    this.client = new MongoClient(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this._cacheManager = {}
  }

  async init() {
    try {
      await this.client.connect()
      this.root = this.client.db(process.env.DB_NAME)
      const memoryCache = cacheManager.caching({
        store: 'memory',
        max: 500,
        ttl: 30,
      })
      this.cache = memoryCache
      if (process.env.NODE_ENV === 'development') {
        Logger.setLevel('debug')
      }
      this.ready = true
    } catch (err) {
      console.log(err)
    }
  }

  async cacheManager(
    key,
    opts = {
      store: 'memory',
      max: 500,
      ttl: 5 * 60,
    }
  ) {
    if (!this._cacheManager[key]) {
      const memoryCache = cacheManager.caching(opts)
      this._cacheManager[key] = memoryCache
    }
    return this._cacheManager[key]
  }
}

const db = new Database()

export default db
