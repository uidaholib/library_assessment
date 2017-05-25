import moment from 'moment'

const BUILDING_SPACES = [
  {
    space: '1A',
    name: 'Group Study'
  }, {
    space: '1B',
    name: 'Cafe'
  }, {
    space: '1C',
    name: 'Landing'
  }, {
    space: '1D',
    name: 'Computer Lab'
  }, {
    space: '1E',
    name: 'Individual/Small Group Study'
  }, {
    space: '1F',
    name: 'MILL (134)'
  }, {
    space: '1G',
    name: 'Group Study (133)'
  }, {
    space: '1H',
    name: 'Group Study (132)'
  }, {
    space: '1I',
    name: 'Group Study (131)'
  }, {
    space: '1J',
    name: 'Classroom (120)'
  }, {
    space: '2A',
    name: '2nd floor'
  }, {
    space: '3A',
    name: '3rd floor'
  }, {
    space: '4A',
    name: '4th floor'
  }, {
    space: '3A_1',
    name: 'IMTC Area 1'
  }, {
    space: '3B_1',
    name: 'IMTC Area 2'
  }, {
    space: '3C_1',
    name: 'IMTC Area 3'
  }, {
    space: '3D_1',
    name: 'IMTC Area 4'
  }
]

const BUILDING_USES = [
  {
    id: 0,
    use: 'Browsing Stacks'
  }, {
    id: 1,
    use: 'Individual Studying'
  }, {
    id: 2,
    use: 'Lounging'
  }, {
    id: 3,
    use: 'Meeting / Group Study'
  }, {
    id: 4,
    use: 'Meeting / Service Point (Circulation / Reference / ITS Help)'
  }, {
    id: 5,
    use: 'Using Library Computers'
  },
   {
    id: null,
    use: 'N/A'
  }
]

function buildingUseFormatter(value) {
  const building = BUILDING_USES.find(building => building.id === value)
  if (building) {
    return building.use
  } else {
    return 'N/A'
  }
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

function roomLocationFormatter(spaceID) {
  const space = BUILDING_SPACES.find(s => s.space === spaceID)
  return space.name
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
        .format();
      dEnd = moment
        .utc()
        .endOf('day')
        .format();
      break
    case 'Yesterday':
      dStart = moment
        .utc()
        .subtract(1, 'days')
        .startOf('day')
        .format();
      dEnd = moment
        .utc()
        .subtract(1, 'days')
        .endOf('day')
        .format();
      break
    case 'This Week':
      dStart = moment
        .utc()
        .weekday(0)
        .format();
      dEnd = moment
        .utc()
        .weekday(6)
        .format();
      break
    case 'Last Week':
      dStart = moment
        .utc()
        .weekday(-7)
        .format();
      dEnd = moment
        .utc()
        .weekday(-1)
        .format();
      break
    case 'This Month':
      dStart = moment
        .utc()
        .startOf('month')
        .format();
      dEnd = moment
        .utc()
        .endOf('month')
        .format();
      break
    case 'Last Month':
      dStart = moment
        .utc()
        .subtract(1, 'months')
        .startOf('month')
        .format();
      dEnd = moment
        .utc()
        .subtract(1, 'months')
        .endOf('month')
        .format();
      break
    case 'This Year':
      dStart = moment
        .utc()
        .startOf('year')
        .format();
      dEnd = moment
        .utc()
        .endOf('year')
        .format();
      break
    case 'Last Year':
      dStart = moment
        .utc()
        .subtract(1, 'years')
        .startOf('year')
        .format('YYYY-MM-DD');
      dEnd = moment
        .utc()
        .subtract(1, 'years')
        .endOf('year')
        .format('YYYY-MM-DD');
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

function getRoomLocationFromQuery(response) {
  if (response.features.length !== 0) {
    const spaceID = response
      .features[0]
      .properties
      .SpaceID
      .toString()
    const space = roomLocationFormatter(spaceID)
    return space
  }
}

export default {
  durationFormatter,
  getItemsFromQuery,
  buildingNameFormatter,
  buildingUseFormatter,
  roomLocationFormatter,
  getRoomLocationFromQuery,
  BUILDING_USES
}