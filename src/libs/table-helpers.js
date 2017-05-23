import moment from 'moment'

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
  let date = new Date(value)
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

function durationFormatter(value) {
  let dStart
    let dEnd
      switch (value) {
        case 'Today':
          dStart = moment
            .utc()
            .startOf('day')
            .format()
            dEnd = moment
            .utc()
            .endOf('day')
            .format()
            break
        case 'Yesterday':
          dStart = moment
            .utc()
            .subtract(1, 'days')
            .startOf('day')
            .format()
            dEnd = moment
            .utc()
            .subtract(1, 'days')
            .endOf('day')
            .format()
            break
        case 'This Week':
          dStart = moment
            .utc()
            .weekday(0)
            .format()
            dEnd = moment
            .utc()
            .weekday(6)
            .format()
            break
        case 'Last Week':
          dStart = moment
            .utc()
            .weekday(-7)
            .format()
            dEnd = moment
            .utc()
            .weekday(-1)
            .format()
            break
        case 'This Month':
          dStart = moment
            .utc()
            .startOf('month')
            .format()
            dEnd = moment
            .utc()
            .endOf('month')
            .format()
            break
        case 'Last Month':
          dStart = moment
            .utc()
            .subtract(1, 'months')
            .startOf('month')
            .format()
            dEnd = moment
            .utc()
            .subtract(1, 'months')
            .endOf('month')
            .format()
            break
        case 'This Year':
          dStart = moment
            .utc()
            .startOf('year')
            .format()
            dEnd = moment
            .utc()
            .endOf('year')
            .format()
            break
        case 'Last Year':
          dStart = moment
            .utc()
            .subtract(1, 'years')
            .startOf('year')
            .format('YYYY-MM-DD')
            dEnd = moment
            .utc()
            .subtract(1, 'years')
            .endOf('year')
            .format('YYYY-MM-DD')
            break
          case 'All':
            dStart = moment
            .utc('1900-01-01')
            .format();
            dEnd = moment
            .utc()
            .endOf('day')
            .format();
            break
        default:
          break
      }
      return {start: dStart, end: dEnd}
    }

    function getItemsFromQuery(response) {
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
      buildingNameFormatter,
      durationFormatter
    }