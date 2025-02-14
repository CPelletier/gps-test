class RateLimiter {
  private limit: number
  private interval: number
  private count: number
  private queue: Array<() => void>

  constructor(limit: number, interval: number) {
    this.limit = limit
    this.interval = interval
    this.count = 0
    this.queue = []

    // Réinitialise le compteur à chaque intervalle (ici 60 000 ms = 1 minute)
    setInterval(() => this.reset(), this.interval)
  }

  private reset() {
    this.count = 0
    // Traiter les requêtes en file tant qu'on est en-dessous de la limite
    while (this.queue.length > 0 && this.count < this.limit) {
      const fn = this.queue.shift()
      if (fn) {
        fn()
        this.count++
      }
    }
  }

  /**
   * Planifie l'exécution de la fonction `fn` en respectant la limite.
   * @param fn Une fonction qui retourne une Promise (par exemple, un appel fetch)
   */
  public schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const execute = () => {
        fn().then(resolve).catch(reject)
      }

      if (this.count < this.limit) {
        // On peut exécuter immédiatement
        this.count++
        execute()
      } else {
        // On dépasse la limite, on ajoute à la file
        this.queue.push(execute)
      }
    })
  }
}

// Exportation d'une instance avec la limite souhaitée : 120 requêtes par minute (60000 ms)
export default new RateLimiter(120, 60000)
