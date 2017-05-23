function buildingUseFormatter(value) {
  let use
  switch (value) {
    case 0:
      use = 'Browsing Stacks'
      break
    case 1:
      use = 'Individual Studying'
      break
    case 2:
      use = 'Lounging'
      break
    case 3:
      use = 'Meeting / Group Study'
      break
    case 4:
      use = 'Meeting / Service Point (Circulation / Reference / ITS Help)'
      break
    case 5:
      use = 'Using Library Computers'
      break
    default:
      use = 'N/A'
      break
  }
  return use
}

function buildingNameFormatter(value) {
  let name
  switch (value) {
    case 1:
      name = 'Library'
      break
  
    default:
      name = 'Unknown'
      break
  }
  return name
}

function dateFormatter(value) {
  let date = new Date(value);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
  const when = new Intl
    .DateTimeFormat('en-US', options)
    .format(date)
  return when
}

function getItemsFromQuery(response) {
  console.log('response', response)
  let results = []
  const features = response.features
  const properties = features.map(feature => feature.properties)
  properties.forEach(item => {
    results.push({
      value: false,
      date: dateFormatter(item.CreationDate),
      use: buildingUseFormatter(item.TYPE_OF_USAGE),
      numberOfUsers: item.NUMBER_OF_USERS
    })
  })
  return results
}
export default {
  getItemsFromQuery,
  buildingNameFormatter
}