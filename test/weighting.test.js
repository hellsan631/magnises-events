import test from 'ava';
import Magnises from '../lib/magnises.js';

test.cb('Plus User - Test Weighting For All', t => {
  t.plan(4);

  var m = new Magnises(getUser('plus'));

  var weightedList = m.weight(getTestEvents('full'));

  weightedList.forEach(function(event) {
    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 2);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 3);
    }
  });

  t.end();
});

test.cb('Regular User - Test Weighting For All', t => {
  t.plan(4);

  var m = new Magnises(getUser('regular'));

  var weightedList = m.weight(getTestEvents('full'));

  weightedList.forEach(function(event) {
    if (event.title === 'plus featured') {
      t.is(findHigherWeight(weightedList, event), 3);
    }

    if (event.title === 'plus regular') {
      t.is(findHigherWeight(weightedList, event), 0);
    }

    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 2);
    }
  });

  t.end();
});

test.cb('Plus User - Test Weighting For Regular', t => {
  t.plan(4);

  var m = new Magnises(getUser('plus'));

  var weightedList = m.weight(getTestEvents('regular'));

  weightedList.forEach(function(event) {
    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 3);
    }
  });

  t.end();
});

test.cb('Regular User - Test Weighting For Regular', t => {
  t.plan(4);

  var m = new Magnises(getUser('regular'));

  var weightedList = m.weight(getTestEvents('regular'));

  weightedList.forEach(function(event) {
    if (event.title === 'regular featured') {
      t.is(findHigherWeight(weightedList, event), 1);
    }

    if (event.title === 'regular') {
      t.is(findHigherWeight(weightedList, event), 3);
    }
  });

  t.end();
});

function findHigherWeight(list, event) {
  return list.filter(function(item) {
    return item.weight >= event.weight && item._id !== event._id;
  }).length;
}

function findSameWeight(list, weight) {
  return list.filter(function(item) {
    return item.weight === weight;
  }).length;
}

function getTestEvents(type) {
  if (type === 'full') return _getFullArray();
  if (type === 'regular') return _getRegularArray();
}

function getUser(type) {
  return _buildUser(type);
}

function _getFullArray() {
  return [
    _buildEvent('plus featured'),
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

function _buildEvent(type) {
  var plus     = type.indexOf('plus') > -1;
  var regular  = type.indexOf('regular') > -1;
  var featured = type.indexOf('featured') > -1;

  return {
    _id: uuid(),
    title: type,
    featured: featured,
    plus: plus,
    public: regular
  };
}

function _buildUser(type) {
  return {
    name: 'Test User',
    plus: type.indexOf('plus') > -1
  };
}

function uuid() {
   return (Math.random() + '').replace('.', '') +  (Math.random() + '').replace('.', '');
}
