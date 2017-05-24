// filters = [{name: 'Individual Studying', field: 'use', value: 'numberOfUsers'},
// ...]
function toChartData(items, filters, label, backgroundColor) {
  let data = []
  let labels = []
  filters.forEach(filter => {
    const item = aggregateFields(items, filter)
    labels.push(item.name)
    data.push(item.total)
  })
  const datasets = [{label, backgroundColor, data}]
  const dataCollection = {
    labels,
    datasets
  }
  return dataCollection
}

/**
 *
 * @param {* array & objects } items array of objects
 * @param {* An object with properties: name, field, value } filter
 */
function aggregateFields(items, filter) {
  const filtered = items.filter(item => item[filter.field] === filter.name).map(item => item[filter.value])
  const total = filtered.reduce((prev, curr) => prev + curr, 0)
  const name = filter.name
  console.log('filtered: ', filtered)
  console.log('total: ', total)
  return {name, total}
}

export default {
  aggregateFields,
  toChartData
}