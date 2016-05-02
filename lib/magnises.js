exports = module.exports = Magnises;

function Magnises(user) {
  this.user = user;
}

Magnises.prototype.weight = function (events) {
  var self = this;

  return events.map(function(event) {
    return self._mapWeight(event);
  });
};

Magnises.prototype._mapWeight = function (event) {
  event.weight = 0;

  if (event.plus) {
    event.weight += 6;
  }

  if (event.featured) {
    event.weight += 5;
  }

  if (this.user.plus) {
    if (event.plus && !event.public) {
      event.weight += 5;
    }
  } else {
    if (event.plus && !event.public) {
      event.weight -= 15;
    }
  }

  return event;
};
