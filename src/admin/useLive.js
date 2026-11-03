// useLive.js: keeps a list up to date by itself ("live"), without reloading the page.
import { useEffect, useRef, useState } from 'react'

// subscribe = ordersApi.subscribe or messagesApi.subscribe. They call us again every time the data changes.
// onNew     = optional function called once for every item that appears AFTER the first load.
// Returns [items, ready, fresh]:
//   items = the current list, ready = true after the first load, fresh = ids that just arrived (for a flash).
export function useLive(subscribe, onNew) {
  const [items, setItems] = useState([])
  const [ready, setReady] = useState(false)
  const [fresh, setFresh] = useState([])
  // seen = the ids we already knew about, so we can spot new ones
  const seen = useRef(null)
  // Always call the newest version of onNew
  const onNewRef = useRef(onNew)
  onNewRef.current = onNew

  useEffect(() => {
    const stop = subscribe((list) => {
      // Not the first list: find the items that were not there before
      if (seen.current) {
        const added = list.filter((i) => !seen.current.has(i.id))
        if (added.length) {
          added.forEach((i) => onNewRef.current && onNewRef.current(i))
          const ids = added.map((i) => i.id)
          setFresh((f) => [...f, ...ids])
          // Stop the flash after 6 seconds
          setTimeout(() => setFresh((f) => f.filter((id) => !ids.includes(id))), 6000)
        }
      }
      seen.current = new Set(list.map((i) => i.id))
      setItems(list)
      setReady(true)
    })
    // Stop listening when the page is closed
    return stop
  }, [subscribe])

  return [items, ready, fresh]
}
