import test from 'ava';
import Magnises from '../lib/magnises.js';

test.cb('Plus User - Test Weighting For All', t => {
  t.plan(6);

  var m = new Magnises(getUser('plus'));

  var weightedList = m.weight(getTestEvents('full'));

  weightedList.forEach(event => {
    if (event.title === 'plus featured exclusive') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'plus exclusive') {
      t.is(findHigherWeight(weightedList, event), 2);
    }

    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 3);
    }

    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 4);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 5);
    }
  });

  t.end();
});

test.cb('Regular User - Test Weighting For All', t => {
  t.plan(6);

  var m = new Magnises(getUser('regular'));

  var events = getTestEvents('full');

  var weightedList = m.weight(events);

  events.forEach(event => {
    if (event.title === 'plus featured exclusive') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    // Same weight?
    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 2);
    }
    if (event.title === 'plus exclusive') {
      t.is(findHigherWeight(weightedList, event), 2);
    }

    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 4);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 5);
    }
  });

  t.end();
});

test.cb('Company User - Test Weighting For All', t => {
  t.plan(8);

  var m = new Magnises(getUser('plus company'));

  var weightedList = m.weight(getTestEvents('company', m.user));

  weightedList.forEach(event => {

    if (event.title === 'plus featured exclusive') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'plus exclusive') {
      t.is(findHigherWeight(weightedList, event), 2);
    }

    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 3);
    }

    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 4);
    }

    // Same weight?
    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 5);
    }
    if (event.title === 'company') {
      t.is(findHigherWeight(weightedList, event), 5);
    }

    if (event.title === 'company') {
      t.is(findExistance(weightedList, event), 1);
    }
  });

  t.end();
});

test.cb('Regular User - Test Weighting For All', t => {
  t.plan(7);

  var m = new Magnises(getUser('regular'));

  var events = getTestEvents('company', m.user);

  var weightedList = m.weight(events);

  events.forEach(event => {

    if (event.title === 'plus featured exclusive') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    // Same weight?
    if (event.title === 'plus exclusive') {
      t.is(findHigherWeight(weightedList, event), 2);
    }
    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 2);
    }
    
    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 4);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 5);
    }

    if (event.title === 'company') {
      t.is(findExistance(weightedList, event), 0);
    }
  });

  t.end();
});

function findExistance(list, event) {
  return list.filter(function(item) {
    return item._id === event._id;
  }).length;
}

function findHigherWeight(list, event) {
  return list.filter(function(item) {
    return item.weight > event.weight && item._id !== event._id;
  }).length;
}

function findSameWeight(list, weight) {
  return list.filter(function(item) {
    return item.weight === weight;
  }).length;
}

function getTestEvents(type, user) {
  if (type === 'full') return _getFullArray();
  if (type === 'regular') return _getRegularArray();
  if (type === 'company') return _getCompanyArray(user);
}

function getUser(type) {
  return _buildUser(type);
}

function _getCompanyArray(user) {
  return [
    _buildEvent('company', user),
    _buildEvent('plus featured exclusive'),
    _buildEvent('plus featured'),
    _buildEvent('plus exclusive'),
    _buildEvent('plus regular'),
    _buildEvent('regular featured'),
    _buildEvent('regular')
  ];
}

function _getFullArray() {
  return [
    _buildEvent('plus featured exclusive'),
    _buildEvent('plus featured'),
    _buildEvent('plus exclusive'),
    _buildEvent('plus regular'),
    _buildEvent('regular featured'),
    _buildEvent('regular')
  ];
}

function _getRegularArray() {
  return [
    _buildEvent('regular featured'),
    _buildEvent('regular'),
    _buildEvent('regular'),
    _buildEvent('regular featured')
  ];
}

function _buildEvent(type, user) {
  var regular   = type.indexOf('regular') > -1;
  var featured  = type.indexOf('featured') > -1;
  var exclusive = type.indexOf('exclusive') > -1;
  var company   = type.indexOf('company') > -1;

  if (company) {
    company = user.company ? user.company : uuid();
  }

  var plus;

  if (type.indexOf('plus') > -1) {
    plus = exclusive ? 'plus exclusive' : 'plus enhanced';
  } else {
    plus = 'none';
  }

  return {
    _id: uuid(),
    title: type,
    featured: featured,
    event_type: plus,
    company: company
  };
}

function _buildUser(type) {
  return {
    name: 'Test User',
    plus_member: type.indexOf('plus') > -1,
    company: type.indexOf('company') > -1 ? uuid() : false
  };
}

function uuid() {
   return (Math.random() + '').replace('.', '') +  (Math.random() + '').replace('.', '');
}
