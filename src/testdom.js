/** @jsx h **/

const root = document.body


// CONSTANTS

const TYPES = [
  'shoes',
  'trousers',
  'socks',
  'skirts',
  'shirts',
  'blouses',
]


const MAKERS = [
  'Mike & Co.',
  'Farrismo',
  'Shitless',
  'Gimmedime',
  'A la ropa',
]


const CONVERSION_RATE = 1.2  // USD per EUR

const CURRENCY_SWITCH = {
  EUR: 'USD',
  USD: 'EUR',
}


// Utility functions


const forEach = (fn, arr) => {
  const l = arr.length
  for (let i = 0; i < l; i += 1) {
    fn(arr[i])
  }
}


const flatten = arr => {
  let out = []
  forEach(x => out = out.concat(x), arr)
  return out
}


const map = (fn, arr) => {
  const out = []
  forEach(x => out.push(fn(x)), arr)
  return out
}


const filter = (fn, arr) => {
  const out = []
  forEach(x => {
    if (fn(x)) {
      out.push(x)
    }
  }, arr)
  return out
}


const range = (start, end) => {
  const out = []
  for (let i = start; i <= end; i += 1) {
    out.push(i)
  }
  return out
}


const clearChildren = node => {
  node.textContent = ''
}


const replaceChildren = (childNodes, node) => {
  clearChildren(node)
  forEach(child => {
    node.appendChild(child)
  }, flatten(childNodes))
}


// Low-level support code
// https://codeburst.io/taming-huge-collections-of-dom-nodes-bebafdba332
// h('div', {class: 'product'}, [
//   h('span', {class: 'id'}, product.id),
//   h('span', {class: 'type'}, product.type),
// ])

const h = (tag, attrs, ...children) => {
  const elm = document.createElement(tag)
  for (let key in attrs) {
    if (key === 'ref') continue
    if (key.slice(0, 2) == 'on') {
      const evtName = key.slice(2)
      const topic = attrs[key]
      if (topic == null) continue  // we can use null or undefnied to suppress
      elm.addEventListener(evtName, event => {
        pubSub.publish(topic, event)
      }, false)
    } else if (['disabled', 'autocomplete', 'selected', 'checked'].indexOf(key) > -1) {
      if (attrs[key]) {
        elm.setAttribute(key, key)
      }
    } else {
      if (attrs[key] == null) continue  // Don't set undefined or null attributes
      elm.setAttribute(key, attrs[key])
    }
  }
  if (children.length === 0) {
    return elm
  }
  forEach(child => {
    if (child instanceof Node) {
      elm.appendChild(child)
    } else {
      elm.appendChild(document.createTextNode(child))
    }
  }, flatten(children))
  return elm
}


const pubSub = (() => {
  const subscribers = {}

  return {
		publish(topic) {
      const data = [].slice.call(arguments, 1)
      const topicSubscribers = subscribers[topic]
      if (topicSubscribers == null) {
        return
      }
      topicSubscribers.forEach(s => {
        s.apply(undefined, data)
      })
    },
    subscribe(topic, fn) {
      subscribers[topic] = subscribers[topic] || []
      subscribers[topic].push(fn)
      return () => {
        const idx = subscribers[topic].indexOf(fn)
        if (idx === -1) {
          return
        }
        subscribers[topic].splice(idx, 1)
      }
    },
    unsubscribe(topic, fn) {
      if (subscribers[topic] == null) {
      	return
      }
      const idx = subscribers[topic].indexOf(fn)
      if (idx === -1) {
      	return
      }
      subscribers[topic].splice(idx, 1)
    },
  }
})()


const createStore = initial => {
  let state = Object.freeze(initial)
  let pendingBroadcast

  return {
  	update(fn, afterUpdate) {
      const originalState = state
      state = Object.freeze(fn(state))

      // If the states are identical, there's no need to alarm everyone about it
      if (originalState === state) return

      // Interupt any pending broadcasts to take care of all state changes
      // before actually broadcasting
      if (pendingBroadcast) clearTimeout(pendingBroadcast)

      // Schedule a state change broadcast
      pendingBroadcast = setTimeout(() => {
        pubSub.publish('stateUpdate', state, originalState)
      })

      // If afterUpdate hook is specified, publish it
      if (afterUpdate) pubSub.publish(afterUpdate, state, originalState)
    },
    get current() {
      return state
    },
  }
}


// Render functions


const priceToCurrency = (currency, price) => {
  return {
    'EUR': price,
    'USD': price * CONVERSION_RATE,
  }[currency]
}


const renderProduct = (currency, product) => (
  <li class="product">
    <span class="cell cell-id">{product.id}</span>
    <span class="cell cell-type">{product.type}</span>
    <span class="cell cell-maker">{product.maker}</span>
    <span class="cell cell-price">
      {currency} {priceToCurrency(currency, product.price).toFixed(2)}
    </span>
  </li>
)


const finalizeProductList = ({selectedType, maxPrice, products, currency}) => {
  console.time('filter list')
  if (selectedType === null && !maxPrice) {
    console.log('not filtering because filter conditions are void')
    return products
  }

  const filtered = filter(product => {
    return (
      !selectedType ||
      product.type === selectedType
    ) && (
      !maxPrice ||
      priceToCurrency(currency, product.price) < maxPrice
    )
  }, products)
  console.timeEnd('filter list')
  console.log('got', filtered.length, 'products')
  return filtered
}


const renderOptions = state => TYPES.map(type => (
  <option value={type} selected={type === state.selected}>{type}</option>
))


const productListHeader = (
  <li class="header">
    <span class="hdr hdr-type">id</span>
    <span class="hdr hdr-type">type</span>
    <span class="hdr hdr-maker">maker</span>
    <span class="hdr hdr-price">price</span>
  </li>
)


const renderCurrencySelector = state => {
  const nextCurrency = CURRENCY_SWITCH[state.currency]
  return (
    <button onclick="selectCurrency" data-currency={nextCurrency}>
      {nextCurrency}
    </button>
  )
}


const renderInitial = context => {
  const state = context.state.current
  const priceFilter = (
    <input
      class="priceFilter"
      value={state.maxPrice}
      oninput="updateFilter"
      placeholder="max price"
      />
  )
  const typeSelect = (
    <select class="typeSelect" onchange="selectType">
      <option value="">Select a type</option>
      {renderOptions(state)}
    </select>
  )

  // To render the product list, we render the nodes and also build up a mapping
  // between the product ID and the rendered node. This ref mapping is not going
  // to be updated throught the life of this view. We will treat is as cached
  // DOM nodes that can later be filtered and otherwise manipulated.
  //
  // For instance, look at how `updateProductList()` uses the refs to rebuild a
  // new list of nodes without re-rendering a single one, purely based on the
  // data.
  const productRefs = {}
  const products = []
  forEach(product => {
    const node = renderProduct(state.currency, product)
    products.push(node)
    productRefs[product.id] = node
  }, state.products)
  const list = (
    <ul class="products">
      {productListHeader}
      {products}
    </ul>
  )
  const currencySelector = renderCurrencySelector(state)
  const main = (
    <div class="main">
      <p class="controls">
        {typeSelect}
        {priceFilter}
        {currencySelector}
      </p>
      {list}
    </div>
  )
  context.refs.root.appendChild(main)
  context.refs.priceFilter = priceFilter
  context.refs.typeSelect = typeSelect
  context.refs.list = list
  context.refs.products = productRefs
  context.refs.currencySelector = currencySelector
}


// Event handlers


const updateMaxPrice = (context, text) => {
  const parsed = parseInt(text, 10)
  const valid = !isNaN(parsed)
  context.state.update(state => {
    return {
      ...state,
      maxPrice: valid ? parsed : null,
      error: valid ? null : 'Must be a number',
    }
  })
}


const changeTypeSelection = (context, type) => {
  context.state.update(state => {
    return {...state, selectedType: type || null}
  })
}

const changeCurrency = (context, currency) => {
  context.state.update(state => {
    return {...state, currency: currency}
  })
}

// Patchers


const renderError = (context, oldState) => {
  const {refs} = context
  const state = context.state.current

  // Only do stuff if `state.error` changed
  if (oldState.error === state.error) {
    return
  }

  // Toggle the error class on the input
  if (state.error) {
  	refs.priceFilter.classList.add('error')
  } else {
  	refs.priceFilter.classList.remove('error')
  }

  // Toggle the error message
  if (state.error) {
    const error = (
      <span class="error-msg">
        {state.error}
      </span>
    )
    context.refs.priceFilter.parentNode.insertBefore(
      error, refs.priceFilter.nextSibling)
    refs.error = error
  } else {
    refs.error.parentNode.removeChild(refs.error)
    delete refs.error
  }
}


const updateProductList = (context, oldState) => {
  const {refs} = context
  const state = context.state.current
  const noChange = (
    state.selectedType === oldState.selectedType &&
    state.maxPrice === oldState.maxPrice &&
    state.products === oldState.products &&
    state.currency === oldState.currency
  )

  if (noChange) return

  console.time('update list')
  const finalList = finalizeProductList(state)
  const products = map(product => {
    return refs.products[product.id]
  }, finalList)
  replaceChildren([productListHeader].concat(products), refs.list)
  console.timeEnd('update list')
}


const updatePrices = (context, oldState) => {
  const {refs} = context
  const state = context.state.current
  const noChange = state.currency === oldState.currency

  if (noChange) return

  console.time('update prices')
  forEach(product => {
    const node = refs.products[product.id]
    const price = priceToCurrency(state.currency, product.price).toFixed(2)
    node.lastChild.textContent = (
      `${state.currency} ${price}`
    )
  }, state.products)
  console.timeEnd('update prices')
}


const updateCurrencySelector = (context, oldState) => {
  const {currencySelector} = context.refs
  const state = context.state.current
  const noChange = state.currency === oldState.currency

  if (noChange) return

  const nextCurrency = CURRENCY_SWITCH[state.currency]
  currencySelector.dataset.currency = nextCurrency
  currencySelector.textContent = nextCurrency
}


// Events


const subscriptions = {
  updateFilter: (context, event) => {
    updateMaxPrice(context, event.target.value)
  },
  selectType: (context, event) => {
    changeTypeSelection(context, event.target.value)
  },
  selectCurrency: (context, event) => {
    changeCurrency(context, event.target.dataset.currency)
  },
  stateUpdate: (context, state, oldState) => {
    forEach(cb => {
      cb(context, oldState)
    }, [
      renderError,
      updateProductList,
      updatePrices,
      updateCurrencySelector,
    ])
  },
}


// Let's get the show on the road


// Generate a bunch of random products

const randomPrice = () => Math.round((Math.random() + 0.1) * 3300) / 100

const pickRandom = arr => arr[Math.round(Math.random() * (arr.length - 1))]

const randomProduct = id => ({
  id,
  type: pickRandom(TYPES),
  maker: pickRandom(MAKERS),
  price: randomPrice(),
});

(() => {
  const itemCount = 1000
  const context = {
  	state: createStore({
      currency: 'EUR',
      maxPrice: null,
      error: null,
      selectedType: null,
      products: map(randomProduct, range(1, itemCount)),
    }),
    refs: {
      root: root,
    },
  }

  // Clear existing nodes
  clearChildren(context.refs.root)

  // Clear all refs
  context.refs = {
    root,
  }

  console.log('initialized with', itemCount, 'items')
  console.time('render')
  renderInitial(context)
  console.timeEnd('render')
  for (let topic in subscriptions) {
    pubSub.subscribe(topic, (...args) => {
      subscriptions[topic](context, ...args)
    })
  }
})()
